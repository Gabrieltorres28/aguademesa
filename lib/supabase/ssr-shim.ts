type CookieAdapter = {
  getAll?: () => { name: string; value: string }[]
  setAll?: (cookies: { name: string; value: string; options?: Record<string, unknown> }[]) => void
}

type ClientOptions = {
  cookies?: CookieAdapter
}

function getToken(options?: ClientOptions) {
  return options?.cookies?.getAll?.().find(cookie => cookie.name === "sb-access-token")?.value
}

function headers(anonKey: string, token?: string) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${token || anonKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  }
}

class QueryBuilder {
  private method = "GET"
  private params = new URLSearchParams()
  private body: unknown
  private singleResult = false

  constructor(
    private url: string,
    private anonKey: string,
    private table: string,
    private token?: string
  ) {}

  select(columns = "*") {
    this.params.set("select", columns)
    return this
  }

  insert(payload: unknown) {
    this.method = "POST"
    this.body = payload
    return this
  }

  update(payload: unknown) {
    this.method = "PATCH"
    this.body = payload
    return this
  }

  eq(column: string, value: string) {
    this.params.set(column, `eq.${value}`)
    return this
  }

  gte(column: string, value: string) {
    this.params.set(column, `gte.${value}`)
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    const direction = options?.ascending === false ? "desc" : "asc"
    const current = this.params.get("order")
    this.params.set("order", current ? `${current},${column}.${direction}` : `${column}.${direction}`)
    return this
  }

  limit(count: number) {
    this.params.set("limit", String(count))
    return this
  }

  single() {
    this.singleResult = true
    return this
  }

  async execute() {
    const endpoint = `${this.url}/rest/v1/${this.table}?${this.params.toString()}`
    const response = await fetch(endpoint, {
      method: this.method,
      headers: headers(this.anonKey, this.token),
      body: this.body ? JSON.stringify(this.body) : undefined,
      cache: "no-store",
    })
    const text = await response.text()
    const json = text ? JSON.parse(text) : null
    if (!response.ok) return { data: null, error: { message: json?.message || response.statusText } }
    const data = this.singleResult && Array.isArray(json) ? json[0] : json
    return { data, error: null }
  }

  then(resolve: (value: Awaited<ReturnType<QueryBuilder["execute"]>>) => void, reject: (reason?: unknown) => void) {
    return this.execute().then(resolve, reject)
  }
}

function createRestClient(url: string, anonKey: string, options?: ClientOptions) {
  const token = getToken(options)
  return {
    auth: {
      async getUser() {
        if (!token) return { data: { user: null }, error: null }
        const response = await fetch(`${url}/auth/v1/user`, { headers: headers(anonKey, token), cache: "no-store" })
        if (!response.ok) return { data: { user: null }, error: null }
        return { data: { user: await response.json() }, error: null }
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: headers(anonKey),
          body: JSON.stringify({ email, password }),
        })
        const json = await response.json()
        if (!response.ok) return { data: null, error: { message: json?.error_description || "Login inválido" } }
        options?.cookies?.setAll?.([
          { name: "sb-access-token", value: json.access_token, options: { path: "/", httpOnly: true, sameSite: "lax" } },
        ])
        return { data: json, error: null }
      },
      async signOut() {
        options?.cookies?.setAll?.([{ name: "sb-access-token", value: "", options: { path: "/", maxAge: 0 } }])
        return { error: null }
      },
      async updateUser(payload: { password?: string }) {
        if (!token) return { data: null, error: { message: "Sesión no encontrada" } }
        const response = await fetch(`${url}/auth/v1/user`, {
          method: "PUT",
          headers: headers(anonKey, token),
          body: JSON.stringify(payload),
        })
        const json = await response.json().catch(() => null)
        if (!response.ok) return { data: null, error: { message: json?.msg || json?.message || "No se pudo actualizar el usuario" } }
        return { data: { user: json }, error: null }
      },
    },
    from(table: string) {
      return new QueryBuilder(url, anonKey, table, token)
    },
  }
}

export function createBrowserClient(url: string, anonKey: string) {
  return createRestClient(url, anonKey)
}

export function createServerClient(url: string, anonKey: string, options?: ClientOptions) {
  return createRestClient(url, anonKey, options)
}

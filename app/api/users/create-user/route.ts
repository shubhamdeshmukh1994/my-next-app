import { type NextRequest, NextResponse } from "next/server"

export async function get() {
  
   return NextResponse.json({ ok: false, message: "Hello from server" }, { status: 200 })
}
 
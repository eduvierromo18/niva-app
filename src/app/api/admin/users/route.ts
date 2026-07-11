import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Las invitaciones estan deshabilitadas hasta completar el modelo de permisos de Niva." },
    { status: 403 },
  );
}

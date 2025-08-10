export async function GET() {
  const res = await fetch("https://api.fontsource.org/v1/fonts", {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    return Response.json(
      { error: "Error al obtener las fuentes" },
      { status: 500 },
    );
  }

  const data = await res.json();

  return Response.json(data);
}

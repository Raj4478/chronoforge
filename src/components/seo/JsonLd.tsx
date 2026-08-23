/** Render one or more JSON-LD blocks as <script type="application/ld+json">. */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown> | null> }) {
  const blocks = Array.isArray(data) ? data.filter(Boolean) : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe to inline; there is no user input here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

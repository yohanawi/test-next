// components/StructuredData.tsx
interface StructuredDataProps {
    data: Record<string, unknown>;
}

export default function StructuredData({ data }: StructuredDataProps) {
    if (!data) return null;

    return (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
    );
}

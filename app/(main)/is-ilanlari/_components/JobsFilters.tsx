import { Button } from "@/components/ui/button"

const filters = ["Tümü", "Uzaktan", "Hibrit", "Ofis", "Junior", "Mid-Level", "Senior"]

export function JobsFilters() {
    return (
        <section className="pb-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap gap-2 justify-center">
                    {filters.map((filtre) => (
                        <Button key={filtre} variant="outline" size="sm">
                            {filtre}
                        </Button>
                    ))}
                </div>
            </div>
        </section>
    )
}


import { cn } from "@/lib/utils"
import { Marquee } from "../ui/marquee"

const reviews = [
    {
        name: "Ahmet Yılmaz",
        username: "@ahmetyilmaz",
        body: "Yapay zeka eşleşmesi sayesinde kendime en uygun takımı buldum. Süreç çok hızlıydı.",
        img: "https://avatar.vercel.sh/ahmet",
    },
    {
        name: "Selin Demir",
        username: "@selindemir",
        body: "İK süreçlerimizde CV eleme yükünü %80 azalttık. Gerçekten devrim niteliğinde.",
        img: "https://avatar.vercel.sh/selin",
    },
    {
        name: "Mert Kaya",
        username: "@mertkaya",
        body: "Geliştirici odaklı yaklaşımı ve teknik yetkinlik bazlı eşleştirmesi harika.",
        img: "https://avatar.vercel.sh/mert",
    },
    {
        name: "Ayşe Yıldız",
        username: "@ayseyildiz",
        body: "Sistemin bize en iyi adayları getirmesi işe alım sürecimizi çok hızlandırdı.",
        img: "https://avatar.vercel.sh/ayse",
    },
    {
        name: "Can Arslan",
        username: "@canarslan",
        body: "Kariyer hedeflerime en uygun ilanları her gün listelenmiş bir şekilde görüyorum.",
        img: "https://avatar.vercel.sh/can",
    },
    {
        name: "Zeynep Aksoy",
        username: "@zeynepaksoy",
        body: "Şirket kültürü ve yetenek uyumu konusunda nokta atışı sonuçlar alıyoruz.",
        img: "https://avatar.vercel.sh/zeynep",
    },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string
    name: string
    username: string
    body: string
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    )
}

export function HomeMarquee() {
    return (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden my-32">
            <Marquee pauseOnHover className="[--duration:20s]">
                {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
                {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
            <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
        </div>
    )
}

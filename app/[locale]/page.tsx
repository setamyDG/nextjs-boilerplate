import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })

  return {
    title: t("title"),
    description: t("description"),
    twitter: {
      card: "summary_large_image",
    },
    openGraph: {
      url: "https://next-enterprise.vercel.app/",
      images: [
        {
          width: 1200,
          height: 630,
          // path to the image in .github/assets/project-logo.png
          url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png",
        },
      ],
    },
  }
}

export default function Home() {
  const t = useTranslations("home")
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />

      <section className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
          {t("title")}
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Looking for a starting point or more instructions? Head over to{" "}
          <Link
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-50"
          >
            Templates
          </Link>{" "}
          or the{" "}
          <Link
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-50"
          >
            Learning
          </Link>{" "}
          center.
        </p>
      </section>
    </div>
  )
}

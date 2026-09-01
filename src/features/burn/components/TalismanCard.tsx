import Image from "next/image";
import type {
  GeneratedTalisman,
  TalismanTemplateKey,
} from "@/features/burn/types";
import { splitTalismanPhrase } from "@/features/burn/utils";

const TEMPLATE_ASSETS: Record<TalismanTemplateKey, string> = {
  "talisman-01": "/figma/talisman/templates/talisman-01.png",
  "talisman-02": "/figma/talisman/templates/talisman-02.png",
  "talisman-03": "/figma/talisman/templates/talisman-03.png",
  "talisman-04": "/figma/talisman/templates/talisman-04.png",
  "talisman-05": "/figma/talisman/templates/talisman-05.png",
  "talisman-06": "/figma/talisman/templates/talisman-06.png",
  "talisman-07": "/figma/talisman/templates/talisman-07.png",
  "talisman-08": "/figma/talisman/templates/talisman-08.png",
  "talisman-09": "/figma/talisman/templates/talisman-09.png",
  "talisman-10": "/figma/talisman/templates/talisman-10.png",
  "talisman-11": "/figma/talisman/templates/talisman-11.png",
  "talisman-12": "/figma/talisman/templates/talisman-12.png",
  "talisman-13": "/figma/talisman/templates/talisman-13.png",
};

type TalismanCardProps = {
  talisman: GeneratedTalisman;
  variant?: "full" | "list" | "report";
};

export default function TalismanCard({
  talisman,
  variant = "full",
}: TalismanCardProps) {
  const characters = splitTalismanPhrase(talisman.phrase) ?? ["", "", "", ""];
  const templateAsset =
    TEMPLATE_ASSETS[talisman.templateKey] ?? TEMPLATE_ASSETS["talisman-13"];
  const radiusClass = {
    full: "rounded-[15px]",
    list: "rounded-[4.331px]",
    report: "rounded-[4.297px]",
  }[variant];

  return (
    <article
      aria-label={`${talisman.phrase} 마음부적`}
      className={`relative aspect-[345/476] w-full overflow-hidden bg-[#ffcd4a] [container-type:inline-size] ${radiusClass}`}
    >
      <Image
        alt=""
        className="object-fill"
        fill
        priority
        src={templateAsset}
        unoptimized
      />

      <div className="absolute left-[13.33%] top-[13.03%] grid h-[14.29%] w-[73.33%] grid-cols-4">
        {characters.map((character, index) => (
          <span
            className="font-talisman flex items-center justify-center pt-[1cqw] text-[11.59cqw] font-normal leading-none text-[#fe7023]"
            key={`${character}-${index}`}
          >
            {character}
          </span>
        ))}
      </div>

      <time
        className="absolute left-1/2 top-[30.25%] -translate-x-1/2 text-[5.8cqw] font-semibold leading-normal text-[#fe7023]"
        dateTime={talisman.generatedAt}
      >
        {formatDate(talisman.generatedAt)}
      </time>
    </article>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).formatToParts(date);
  const year = getDatePart(parts, "year");
  const month = getDatePart(parts, "month");
  const day = getDatePart(parts, "day");

  return `${year}.${month}.${day}`;
}

function getDatePart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

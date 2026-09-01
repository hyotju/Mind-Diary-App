type DiaryImageThumbnailProps = {
  alt: string;
  onRemove: () => void;
  src: string;
};

export default function DiaryImageThumbnail({
  alt,
  onRemove,
  src,
}: DiaryImageThumbnailProps) {
  return (
    <div className="relative size-[88px] shrink-0 overflow-hidden rounded-[12px] border border-orange-400">
      {/* eslint-disable-next-line @next/next/no-img-element -- previews can be local object URLs or short-lived private URLs */}
      <img alt={alt} className="size-full object-cover object-bottom" src={src} />
      <button
        aria-label="사진 삭제"
        className="absolute right-[6px] top-[7px] flex size-4 items-center justify-center text-orange-400"
        onClick={onRemove}
        type="button"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M12 4 4 12M4 4l8 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

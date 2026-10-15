import { whatsappLink } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שלחו לנו הודעה בוואטסאפ"
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition hover:scale-105"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}

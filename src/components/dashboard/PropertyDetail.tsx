"use client";

import {
  Globe,
  MessageCircle,
  FolderOpen,
  MapPin,
  FileSpreadsheet,
  GraduationCap,
  Phone,
  CheckCircle,
  XCircle,
  Building2,
  BadgeDollarSign,
  CalendarClock,
  HandCoins,
} from "lucide-react";
import { Property } from "@/lib/types";

interface PropertyDetailProps {
  property: Property;
}

function isValidUrl(str?: string): boolean {
  if (!str) return false;
  if (str === "-" || str === "—") return false;
  if (/^[CСс][сc]ылка$/i.test(str)) return false;
  return str.startsWith("http://") || str.startsWith("https://");
}

function getDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "");
  } catch {
    return url.substring(0, 30);
  }
}

function LinkItem({
  href,
  icon,
  label,
  color,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  if (!isValidUrl(href)) return null;
  const domain = getDomain(href!);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={href}
      className={`flex items-center gap-2 text-small ${color} hover:underline transition-colors duration-fast`}
    >
      {icon}
      <span>{label}</span>
      <span className="text-text-tertiary text-xs truncate max-w-[200px]">
        ({domain})
      </span>
    </a>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border-subtle bg-card/60 p-4 shadow-sm">
      <h4 className="mb-3 text-xs uppercase tracking-[0.08em] text-text-tertiary">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value || value === "-" || value === "—") return null;
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border-subtle/70 bg-canvas/40 px-3 py-2 text-small">
      <span className="whitespace-nowrap text-text-tertiary">{label}</span>
      <span className="text-right text-text-primary">{value}</span>
    </div>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-canvas/55 px-4 py-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-text-tertiary">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`mt-2 tabular-nums text-body-medium font-semibold ${accent ? "text-accent-primary" : "text-text-primary"}`}>
        {value}
      </div>
    </div>
  );
}

function SummaryChip({ label }: { label: string }) {
  if (!label || label === "-" || label === "—") return null;

  return (
    <span className="inline-flex items-center rounded-full border border-border-card bg-accent-primary-subtle px-3 py-1 text-xs font-medium text-accent-primary">
      {label}
    </span>
  );
}

/**
 * Parse a contact string like "995 514 222 255 Григол, Джули 995 514 222 244, Нино 995 514 222 233"
 * into separate {phone, display} entries for each person.
 */
function parseContacts(raw: string): { phone: string; display: string }[] {
  // Split by comma or newline
  const parts = raw.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);

  return parts.map((part) => {
    // Extract all digit sequences that look like phone numbers (7+ digits when joined)
    const phoneMatch = part.match(/[\d\s+]+/g);
    let phone = "";

    if (phoneMatch) {
      // Find the longest digit sequence as the phone number
      const candidates = phoneMatch.map((m) => m.trim()).filter((m) => m.replace(/\s/g, "").length >= 7);
      if (candidates.length > 0) {
        phone = candidates[0].replace(/\s/g, "");
        // Ensure it starts with + if it's a full international number
        if (phone.length >= 10 && !phone.startsWith("+")) {
          phone = "+" + phone;
        }
      }
    }

    return {
      phone,
      display: part,
    };
  });
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const hasMortgage =
    property.mortgage.toLowerCase() === "да" ||
    property.mortgage.toLowerCase() === "yes";

  return (
    <div className="animate-slide-down border-t border-border-subtle bg-elevated p-4 sm:p-6">
      <div className="card-teal-gradient gradient-overlay overflow-hidden rounded-2xl border border-border-card">
        <div className="relative space-y-6 p-5 sm:card-grid-pattern sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.1em] text-text-tertiary">
                {property.developer || "Девелопер"}
              </p>
              <h3 className="mt-2 text-[24px] font-semibold leading-tight text-text-primary sm:text-[28px]">
                {property.project || "Без названия проекта"}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <SummaryChip label={property.location} />
                <SummaryChip label={property.propertyType} />
                <SummaryChip label={property.finishing} />
                <SummaryChip label={property.deliveryQuarter} />
                <SummaryChip label={hasMortgage ? "Ипотека доступна" : "Без ипотеки"} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:min-w-[360px]">
              <SummaryMetric
                icon={<BadgeDollarSign className="h-3.5 w-3.5" />}
                label="Цена за м²"
                value={property.minPricePerSqm || "—"}
              />
              <SummaryMetric
                icon={<HandCoins className="h-3.5 w-3.5" />}
                label="Комиссия"
                value={property.commissionNet || "—"}
                accent
              />
              <SummaryMetric
                icon={<CalendarClock className="h-3.5 w-3.5" />}
                label="Срок сдачи"
                value={property.deliveryYear || "—"}
              />
              <SummaryMetric
                icon={<Building2 className="h-3.5 w-3.5" />}
                label="Этажность"
                value={property.floors || "—"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <DetailSection title="Условия оплаты">
          <DetailRow label="ПВ и рассрочка" value={property.paymentTerms} />
          <DetailRow
            label="Комиссия чистыми"
            value={property.commissionNet}
          />
          <DetailRow
            label="Комиссия с НДС"
            value={property.commissionWithVAT}
          />
          <DetailRow
            label="Условия выплаты"
            value={property.commissionTerms}
          />
        </DetailSection>

            <DetailSection title="Контакт">
              {property.primaryContact ? (
                <div className="space-y-2">
                  {parseContacts(property.primaryContact).map((contact, idx) => (
                    <a
                      key={idx}
                      href={contact.phone ? `tel:${contact.phone}` : undefined}
                      className="flex items-start gap-3 rounded-lg border border-border-subtle/70 bg-canvas/40 px-3 py-3 text-small text-text-primary transition-colors duration-fast hover:border-border-card hover:text-accent-primary"
                    >
                      <Phone className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" />
                      <span>{contact.display}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-small text-text-tertiary">Контакты не указаны</p>
              )}
            </DetailSection>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailSection title="Характеристики">
              <DetailRow label="Этажность" value={property.floors} />
              <DetailRow label="Ремонт/м²" value={property.renovationPrice} />
              <DetailRow
                label="Комиссия ремонт"
                value={property.renovationCommission}
              />
              <DetailRow label="Доходность" value={property.guaranteedYield} />
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border-subtle/70 bg-canvas/40 px-3 py-2 text-small">
                <span className="text-text-tertiary">Ипотека</span>
                {hasMortgage ? (
                  <span className="flex items-center gap-1 text-semantic-success">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Да
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-text-secondary">
                    <XCircle className="h-3.5 w-3.5" />
                    Нет
                  </span>
                )}
              </div>
            </DetailSection>

            <DetailSection title="Ссылки и материалы">
              <div className="space-y-2">
                <LinkItem
                  href={property.links.website}
                  icon={<Globe className="w-[18px] h-[18px]" />}
                  label="Сайт"
                  color="text-accent-primary"
                />
                <LinkItem
                  href={property.links.whatsapp}
                  icon={<MessageCircle className="w-[18px] h-[18px]" />}
                  label="WhatsApp"
                  color="text-whatsapp"
                />
                <LinkItem
                  href={property.links.googleDisk}
                  icon={<FolderOpen className="w-[18px] h-[18px]" />}
                  label="Google Disk"
                  color="text-accent-primary"
                />
                <LinkItem
                  href={property.links.map}
                  icon={<MapPin className="w-[18px] h-[18px]" />}
                  label="Карта"
                  color="text-semantic-warning"
                />
                <LinkItem
                  href={property.links.priceList}
                  icon={<FileSpreadsheet className="w-[18px] h-[18px]" />}
                  label="Прайс-лист"
                  color="text-semantic-success"
                />
                <LinkItem
                  href={property.trainingLink}
                  icon={<GraduationCap className="w-[18px] h-[18px]" />}
                  label="Обучение"
                  color="text-semantic-info"
                />
              </div>
            </DetailSection>
          </div>

          {property.comments && (
            <DetailSection title="Комментарии">
              <p className="text-small leading-relaxed text-text-secondary">
                {property.comments}
              </p>
            </DetailSection>
          )}
        </div>
      </div>
    </div>
  );
}

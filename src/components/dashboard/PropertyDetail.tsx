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
    <div className="border-l-[3px] border-accent-primary-muted pl-4">
      <h4 className="text-xs uppercase tracking-[0.05em] text-text-tertiary mb-2">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-small">
      <span className="text-text-tertiary whitespace-nowrap">{label}:</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const hasMortgage =
    property.mortgage.toLowerCase() === "да" ||
    property.mortgage.toLowerCase() === "yes";

  return (
    <div className="bg-elevated border-t border-border-subtle p-6 animate-slide-down">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Terms */}
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

        {/* Characteristics */}
        <DetailSection title="Характеристики">
          <DetailRow label="Этажность" value={property.floors} />
          <DetailRow label="Ремонт/м²" value={property.renovationPrice} />
          <DetailRow
            label="Комиссия ремонт"
            value={property.renovationCommission}
          />
          <DetailRow label="Доходность" value={property.guaranteedYield} />
          <div className="flex items-center gap-2 text-small">
            <span className="text-text-tertiary">Ипотека:</span>
            {hasMortgage ? (
              <span className="flex items-center gap-1 text-semantic-success">
                <CheckCircle className="w-3.5 h-3.5" />
                Да
              </span>
            ) : (
              <span className="flex items-center gap-1 text-text-secondary">
                <XCircle className="w-3.5 h-3.5" />
                Нет
              </span>
            )}
          </div>
        </DetailSection>

        {/* Links */}
        <DetailSection title="Ссылки">
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

        {/* Contact */}
        <DetailSection title="Контакт">
          {property.primaryContact && (
            <a
              href={`tel:${property.primaryContact.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-small text-text-primary hover:text-accent-primary transition-colors duration-fast"
            >
              <Phone className="w-[18px] h-[18px]" />
              <span>{property.primaryContact}</span>
            </a>
          )}
        </DetailSection>
      </div>

      {/* Comments */}
      {property.comments && (
        <div className="mt-6">
          <DetailSection title="Комментарии">
            <p className="text-small text-text-secondary leading-relaxed">
              {property.comments}
            </p>
          </DetailSection>
        </div>
      )}
    </div>
  );
}

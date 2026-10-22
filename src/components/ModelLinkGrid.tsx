import { BIKE_MODELS } from "@/data/models";
import { toSearchableBikeModel } from "@/lib/bike-model-search";
import ModelLinkGridClient from "./ModelLinkGridClient";

interface ModelLinkGridProps {
  currentSlug?: string;
}

export default function ModelLinkGrid({ currentSlug }: ModelLinkGridProps) {
  return (
    <ModelLinkGridClient
      models={BIKE_MODELS.map(toSearchableBikeModel)}
      currentSlug={currentSlug}
    />
  );
}

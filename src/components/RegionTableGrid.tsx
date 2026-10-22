import { getTable60Regions, getMainRegions, type Region } from "@/data/regions";
import RegionTableGridClient, {
  type RegionLink,
  type RegionTableGridProps,
} from "./RegionTableGridClient";

function toRegionLink(region: Region): RegionLink {
  const { slug, name, fullName, province, subDistricts } = region;
  return { slug, name, fullName, province, subDistricts };
}

export default function RegionTableGrid(props: RegionTableGridProps = {}) {
  return (
    <RegionTableGridClient
      {...props}
      default60Regions={getTable60Regions().map(toRegionLink)}
      allMainRegions={getMainRegions().map(toRegionLink)}
    />
  );
}

import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;

  const { data: devicesData, error: devicesError } = useWidgetAPI(widget, "devices");
  const { data: positionsData, error: positionsError } = useWidgetAPI(widget, "positions");
  const { data: geofencesData, error: geofencesError } = useWidgetAPI(widget, "geofences");

  if (devicesError || positionsError || geofencesError) {
    const finalError = positionsError ?? devicesError ?? geofencesError;
    return <Container service={service} error={finalError} />;
  }

  if (!devicesData || !positionsData || !geofencesData) {
    return (
      <Container service={service}>
        <Block label="traccar.online" />
        <Block label="traccar.moving" />
      </Container>
    );
  }

  const zoneName = service.widget?.zone;
  const zoneNameLabel = t("traccar.inzone", { value: zoneName });
  const zoneId = geofencesData.find((zone) => zone.name === zoneName)?.id;
  const devicesOnline = devicesData.total > 0 ? `${devicesData.online} / ${devicesData.total}` : "-";

  let devicesInZone = 0;
  let devicesMoving = 0;

  positionsData.forEach((device) => {
    devicesInZone += zoneName != null && device.geofenceIds != null && device.geofenceIds.includes(zoneId);
    devicesMoving += device.motion === true && device.valid === true;
  });

  if (zoneName === null) {
    return (
      <Container service={service}>
        <Block label="traccar.online" value={devicesOnline} />
        <Block label="traccar.moving" value={devicesMoving} />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="traccar.online" value={devicesOnline} />
      <Block label="traccar.moving" value={devicesMoving} />
      <Block label={zoneNameLabel} value={devicesInZone} />
    </Container>
  );
}

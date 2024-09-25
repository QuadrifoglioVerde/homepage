import genericProxyHandler from "utils/proxy/handlers/generic";
import { asJson, jsonArrayFilter } from "utils/proxy/api-helpers";

const widget = {
  api: "{url}/api/{endpoint}",
  proxyHandler: genericProxyHandler,

  mappings: {
    devices: {
      endpoint: "devices",
      map: (data) => ({
        online: jsonArrayFilter(data, (device) => device.disabled === false && device.status === "online").length,
        total: jsonArrayFilter(data, (device) => device.disabled === false).length,
      }),
    },

    positions: {
      endpoint: "positions",
      map: (data) =>
        asJson(data).map((device) => ({
          motion: asJson(device.attributes).motion,
          geofenceIds: device.geofenceIds,
          valid: device.valid,
        })),
    },

    geofences: {
      endpoint: "geofences",
      map: (data) =>
        asJson(data).map((zone) => ({
          id: zone.id,
          name: zone.name,
        })),
    },
  },
};

export default widget;

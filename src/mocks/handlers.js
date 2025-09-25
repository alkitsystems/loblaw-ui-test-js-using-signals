import { http, HttpResponse } from "msw";
import { getCampaigns } from "./campaign-list";
import { campaignData } from "./campaign-data";

export const handlers = [
  http.get("/api/campaigns", () => {
    return HttpResponse.json(getCampaigns());
  }),

  http.get("/api/campaigns/:campaignId", ({ request, params }) => {
    return HttpResponse.json(campaignData(request, params));
  }),
];

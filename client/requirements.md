## Packages
(none needed)

## Notes
Uses existing shadcn/ui components already present in client/src/components/ui
Auth placeholder expects GET /api/me returning CurrentUserResponse (null if not signed in); if missing, dashboard will show “Sign-in required”
All API calls use @shared/routes (api.*.path + buildUrl) and validate responses with Zod schemas from routes manifest
Static logo image is imported from @assets/FBB3DFE0-5F95-49EE-8146-F5F3847A7F91_1770887833995.png (do not reference attached_assets path strings)

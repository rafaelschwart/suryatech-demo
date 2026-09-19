# Unified station workspace and chart motion

Locations and station detail now share /dashboard/operations, with one Stations & map navigation item. A single fleet poll supplies the KPIs, selected marker, station header, power distribution and controls. The selected station and Performance / Equipment / Controls view are represented in the URL. Browser Back, reloads, table actions and legacy /dashboard/stations links retain station context.

The process stepper reserves space for outlines and focus rings and changes to a vertical flow in narrow containers. This applies to both project operations and package preparation.

A shared Anime.js ChartMotion wrapper animates revenue bars from their baseline, draws line and telemetry curves and fades area fills. Axes, tooltips and data remain untouched. Animations start when plots enter the viewport, restore their original styles after completion and immediately show the complete chart for reduced motion. Ordinary polling does not replay entrance animations.

Validation: browser review covers map, picker and table selection, history/reload, legacy deep links, simulated PowerCheck targeting, reset cancellation, equipment access, actual animated SVG marks and runtime reduced motion. Process-flow geometry and page overflow are checked at 320, 390, 768, 1024, 1440 and 1920px on operations, revenue and overview. Desktop, mobile and dark-mode captures are stored in the case workspace under operations-unification.

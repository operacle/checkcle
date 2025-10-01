export interface DockerTranslations {
  // Tables and headers
  dockerContainers: string;
  container: string;
  status: string;
  cpuUsage: string;
  memory: string;
  disk: string;
  uptime: string;
  lastChecked: string;
  actions: string;
  searchContainersPlaceholder: string;
  refresh: string;
  openMenu: string;
  viewMetrics: string;
  viewDetails: string;

  // Status badges and stats
  running: string;
  stopped: string;
  warning: string;
  unknown: string;
  totalContainers: string;
  containersLabel: string;

  // Empty states
  noContainersFound: string;
  noContainersRunning: string;
  tryAdjustSearch: string;
  startSomeContainers: string;

  // Metrics dialog
  containerMetricsTitle: string; // e.g., Container Metrics: {name}
  dockerId: string; // Docker ID
  loadingMetrics: string;
  errorLoadingMetrics: string;
  noMetricsAvailable: string;

  // Time ranges
  minutes60: string;
  day1: string;
  days7: string;
  month1: string;
  months3: string;

  // Metric labels
  used: string;
  free: string;
  total: string;
  usage: string;
  cpu: string;
  memoryTitle: string;
  diskTitle: string;
  network: string;

  // Charts and series
  cpuUsagePct: string;
  cpuUsageVsAvailable: string;
  cpuAvailablePct: string;
  ramUsagePct: string;
  memoryUsageBytes: string;
  usedMemory: string;
  totalMemory: string;
  diskUsagePct: string;
  diskUsageBytes: string;
  usedDisk: string;
  totalDisk: string;
  networkTraffic: string;
  networkSpeedKbs: string;
  rxBytes: string;
  txBytes: string;
  rxSpeedKbs: string;
  txSpeedKbs: string;
}



import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

interface AdminConsoleProps {
  onClose: () => void;
}

export const AdminConsole = ({ onClose }: AdminConsoleProps) => {
  const [tab, setTab] = useState<'overview' | 'campus' | 'blueprints' | 'surveys' | 'moderation' | 'analytics' | 'users'>('overview');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: string; id: string; name: string} | null>(null);

  // State for data loading
  const [overviewData, setOverviewData] = useState<any>(null);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [moderationItems, setModerationItems] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);

  // Fetch data based on tab selection
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Load data based on current tab
        switch (tab) {
          case 'overview': {
            const overview = await adminAPI.getOverview();
            setOverviewData(overview);
            break;
          }
          case 'campus': {
            const campusData = await adminAPI.getCampuses();
            setCampuses(campusData);
            break;
          }
          case 'blueprints': {
            const blueprintsData = await adminAPI.getBlueprints();
            setBlueprints(blueprintsData);
            break;
          }
          case 'surveys': {
            const surveysData = await adminAPI.getSurveys();
            setSurveys(surveysData);
            break;
          }
          case 'moderation': {
            const moderationData = await adminAPI.getModerationQueue();
            setModerationItems(moderationData);
            break;
          }
          case 'analytics': {
            const analytics = await adminAPI.getAnalytics();
            setAnalyticsData(analytics);
            break;
          }
          case 'users': {
            const usersData = await adminAPI.getUsers();
            setUsers(usersData);
            break;
          }
          default:
            break;
        }
      } catch (err) {
        console.error('Admin data fetch error:', err);
        setError('Failed to load admin data');
        // Fallback to simulated data on error
        if (tab === 'overview') {
          setOverviewData({
            campuses: [
              {
                id: 'campus-001',
                name: 'RVRJC College of Engineering',
                boundary: '37.4 acres',
                buildings: 7,
                floors: 22,
                lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'campus-002',
                name: 'IIT Hyderabad',
                boundary: '576 acres',
                buildings: 45,
                floors: 180,
                lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
              }
            ],
            recentMeasurements: 1247,
            uniqueDevices: 89,
            dataQuality: 'Good',
            pendingModeration: 23
          });
        }

        if (tab === 'campus') {
          setCampuses([
            {
              id: 'campus-001',
              name: 'RVRJC College of Engineering',
              boundary: '37.4 acres',
              buildings: 7,
              floors: 22,
              lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'campus-002',
              name: 'IIT Hyderabad',
              boundary: '576 acres',
              buildings: 45,
              floors: 180,
              lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            }
          ]);
        }

        if (tab === 'blueprints') {
          setBlueprints([
            {
              id: 'bp-001',
              name: 'Library Block Floor Plans',
              type: 'PDF',
              campus: 'RVRJC College of Engineering',
              uploaded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              status: 'aligned'
            },
            {
              id: 'bp-002',
              name: 'Cyber Block CAD Layout',
              type: 'DWG',
              campus: 'RVRJC College of Engineering',
              uploaded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              status: 'needs_review'
            }
          ]);
        }

        if (tab === 'surveys') {
          setSurveys([
            {
              id: 'surv-001',
              name: 'Weekly Campus Survey',
              status: 'active',
              routeLength: '2.4 km',
              samplesToday: 45,
              targetSamples: 200,
              lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000)
            },
            {
              id: 'surv-002',
              name: 'Hostel Network Audit',
              status: 'completed',
              routeLength: '1.2 km',
              samplesToday: 0,
              targetSamples: 120,
              lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            }
          ]);
        }

        if (tab === 'moderation') {
          setModerationItems([
            {
              id: 'mod-001',
              location: 'Library Reading Room, Library Block',
              carrier: 'Jio True 5G',
              timestamp: new Date(),
              sampleCount: 12,
              qualityFlags: 'GPS Accuracy: Good • Device: Consistent'
            },
            {
              id: 'mod-002',
              location: 'Computer Lab 205, Cyber Block',
              carrier: 'Campus Wi-Fi 6E',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
              sampleCount: 8,
              qualityFlags: 'GPS Accuracy: Excellent • Device: Consistent'
            },
            {
              id: 'mod-003',
              location: 'Hostel A Wing, Room 304',
              carrier: 'Airtel 5G Plus',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              sampleCount: 15,
              qualityFlags: 'GPS Accuracy: Fair • Device: Inconsistent'
            }
          ]);
        }

        if (tab === 'analytics') {
          setAnalyticsData({
            speedDistribution: {
              labels: ['0-100', '100-200', '200-300', '300-400', '400-500', '500+'],
              data: [5, 15, 25, 30, 15, 10]
            },
            latencyDistribution: {
              labels: ['0-5ms', '5-10ms', '10-20ms', '20-50ms', '50-100ms', '100ms+'],
              data: [40, 30, 15, 10, 4, 1]
            }
          });
        }

        if (tab === 'users') {
          setUsers([
            {
              id: 'user-001',
              name: 'Megha Janga',
              role: 'student',
              campus: 'RVRJC College of Engineering',
              lastActive: new Date()
            },
            {
              id: 'user-002',
              name: 'John Doe',
              role: 'staff',
              campus: 'RVRJC College of Engineering',
              lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000)
            },
            {
              id: 'user-003',
              name: 'Jane Smith',
              role: 'survey_operator',
              campus: 'RVRJC College of Engineering',
              lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tab]); // Reload data when tab changes

  const handleTabChange = (newTab: typeof tab) => {
    setTab(newTab);
  };

  const handleDeleteItem = (type: string, id: string, name: string) => {
    setItemToDelete({type, id, name});
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      // In real app, this would call delete API
      adminAPI.deleteItem(itemToDelete.type, itemToDelete.id).then(() => {
        alert(`${itemToDelete.type} "${itemToDelete.name}" has been deleted.`);
        // Refresh the data after deletion
        handleTabChange(tab);
      }).catch(() => {
        alert('Failed to delete item. Please try again.');
      });
    }
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[92vh] my-auto bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-slate-950/80 border-b border-slate-800 shrink-0">
        <span className="w-3 h-3 rounded-full bg-primary-container inline-block"></span>
        <span className="font-headline-sm text-headline-sm text-primary-container uppercase tracking-wider">
          ADMIN CONSOLE
        </span>
        <button
          className="ml-auto p-1 text-on-surface-variant hover:text-on-surface transition-colors"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 shrink-0 overflow-x-auto no-scrollbar">
        <button
          className={`flex-1 items-center justify-center px-3 py-2 text-mono-metric-sm ${tab === 'overview' ? 'text-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => handleTabChange('overview')}
        >
          Overview
        </button>
        <button
          className={`flex-1 items-center justify-center px-3 py-2 text-mono-metric-sm ${tab === 'campus' ? 'text-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => handleTabChange('campus')}
        >
          Campuses
        </button>
        <button
          className={`flex-1 items-center justify-center px-3 py-2 text-mono-metric-sm ${tab === 'blueprints' ? 'text-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => handleTabChange('blueprints')}
        >
          Blueprints
        </button>
        <button
          className={`flex-1 items-center justify-center px-3 py-2 text-mono-metric-sm ${tab === 'surveys' ? 'text-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => handleTabChange('surveys')}
        >
          Surveys
        </button>
        <button
          className={`flex-1 items-center justify-center px-3 py-2 text-mono-metric-sm ${tab === 'moderation' ? 'text-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => handleTabChange('moderation')}
        >
          Moderation
        </button>
        <button
          className={`flex-1 items-center justify-center px-3 py-2 text-mono-metric-sm ${tab === 'analytics' ? 'text-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => handleTabChange('analytics')}
        >
          Analytics
        </button>
        <button
          className={`flex-1 items-center justify-center px-3 py-2 text-mono-metric-sm ${tab === 'users' ? 'text-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          onClick={() => handleTabChange('users')}
        >
          Users
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-surface-container rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                  System Overview
                </span>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                      <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                        Total Campuses
                      </span>
                    </div>
                    <span className="font-mono-metric-lg text-on-surface">{overviewData?.campuses?.length || 0}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                      <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                        Total Measurements
                      </span>
                    </div>
                    <span className="font-mono-metric-lg text-on-surface">{overviewData?.recentMeasurements?.toLocaleString() || '0'}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                      <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                        Unique Devices
                      </span>
                    </div>
                    <span className="font-mono-metric-lg text-on-surface">{overviewData?.uniqueDevices || 0}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                      <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                        Data Quality
                      </span>
                    </div>
                    <span className="font-mono-metric-lg text-on-surface-capitalize">{overviewData?.dataQuality || 'Unknown'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                  <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                    Pending Moderation
                  </span>
                </div>
                <span className="font-mono-metric-lg text-on-surface">{overviewData?.pendingModeration || 0}</span>
                <span className="text-mono-metric-sm text-on-surface-variant"> items awaiting review</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'campus' && (
          <div className="space-y-4">
            <div className="bg-surface-container rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                  Campus Management
                </span>
                <span className="ml-auto text-mono-metric-sm text-on-surface-variant">
                  {campuses.length} campuses
                </span>
              </div>
              <div className="space-y-3">
                <div className="overflow-y-auto h-40">
                  {campuses.map((campus) => (
                    <div key={campus.id} className="bg-surface-container-low rounded p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary-container inline-block"></div>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Campus Name
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                            onClick={() => handleDeleteItem('campus', campus.id, campus.name)}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="font-headline-sm text-headline-sm text-on-surface">
                        {campus.name}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-3 text-mono-metric-sm">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{
                              backgroundColor: '#10b981'
                            }}></span>
                            <span className="text-on-surface-variant">Buildings</span>
                          </div>
                          <span className="text-on-surface">{campus.buildings}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{
                              backgroundColor: '#10b981'
                            }}></span>
                            <span className="text-on-surface-variant">Floors</span>
                          </div>
                          <span className="text-on-surface">{campus.floors}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{
                              backgroundColor: '#f59e0b'
                            }}></span>
                            <span className="text-on-surface-variant">Last Updated</span>
                          </div>
                          <span className="text-on-surface">{new Date(campus.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'blueprints' && (
          <div className="space-y-4">
            <div className="bg-surface-container rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                  Blueprint Management
                </span>
                <span className="ml-auto text-mono-metric-sm text-on-surface-variant">
                  {blueprints.length} blueprints
                </span>
              </div>
              <div className="space-y-3">
                <div className="overflow-y-auto h-40">
                  {blueprints.map((bp) => (
                    <div key={bp.id} className="bg-surface-container-low rounded p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary-container inline-block"></div>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Blueprint Name
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                            onClick={() => handleDeleteItem('blueprint', bp.id, bp.name)}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                          {bp.name}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Type
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">{bp.type}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Campus
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">{bp.campus}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Uploaded
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">
                          {new Date(bp.uploaded).toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Status
                          </span>
                        </div>
                        <span className={`font-mono-metric-sm text-${bp.status === 'aligned' ? 'tertiary' : bp.status === 'needs_review' ? 'primary' : 'error'}`}>
                          {bp.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'surveys' && (
          <div className="space-y-4">
            <div className="bg-surface-container rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                  Survey Management
                </span>
                <span className="ml-auto text-mono-metric-sm text-on-surface-variant">
                  {surveys.length} active surveys
                </span>
              </div>
              <div className="space-y-3">
                <div className="overflow-y-auto h-40">
                  {surveys.map((survey) => (
                    <div key={survey.id} className="bg-surface-container-low rounded p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary-container inline-block"></div>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Survey Name
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-on-surface-variant hover:text_on-surface transition-colors"
                            onClick={() => handleDeleteItem('survey', survey.id, survey.name)}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                          {survey.name}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Status
                          </span>
                        </div>
                        <span className={`font-mono-metric-sm text-${survey.status === 'active' ? 'tertiary' : survey.status === 'completed' ? 'primary' : 'error'}`}>
                          {survey.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Route Length
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">{survey.routeLength}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Progress
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-low h-2 rounded relative">
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-tertiary rounded h-full"
                            style={{ width: `${Math.min(100, Math.round((survey.samplesToday / survey.targetSamples) * 100))}%` }}
                          ></div>
                        </div>
                        <div className="text-mono-metric-sm text-on-surface-variant mt-2 text-center">
                          {survey.samplesToday}/${survey.targetSamples} samples
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Last Run
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">
                          {new Date(survey.lastRun).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'moderation' && (
          <div className="space-y-4">
            <div className="bg-surface-container rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                  Measurement Moderation Queue
                </span>
                <span className="ml-auto text-mono-metric-sm text-on-surface-variant">
                  {moderationItems.length} pending
                </span>
              </div>
              <div className="space-y-3">
                <div className="overflow-y-auto h-40">
                  {moderationItems.map((item, index) => (
                    <div key={index} className="bg-surface-container-low rounded p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary-container inline-block"></div>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Measurement ID
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-on-surface-variant hover:text_on-surface transition-colors"
                            onClick={() => {}}
                          >
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                          <button
                            className="ml-1 p-1 text-on-surface-variant hover:text_on-surface transition-colors"
                            onClick={() => {}}
                          >
                            <span className="material-symbols-outlined">cancel</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                          Location: {item.location}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Carrier
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">{item.carrier}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Timestamp
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Sample Count
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">{item.sampleCount} samples</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Quality Flags
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface-variant">
                          {item.qualityFlags}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-surface-container rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                  Data Analytics Dashboard
                </span>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                      <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                        Speed Distribution
                      </span>
                    </div>
                    <div className="bg-surface-container-low h-32 relative">
                      {/* Speed distribution chart */}
                      <div className="absolute inset-0 bg-surface-container-low/20 rounded"></div>
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-tertiary"></div>
                      <div className="absolute left-0 bottom-0 w-1 h-full bg-tertiary"></div>
                      {analyticsData?.speedDistribution?.labels?.map((_label: any, index: any) => (
                        <div
                          key={index}
                          className="absolute bottom-0"
                          style={{
                            left: `${(index / analyticsData.speedDistribution.labels.length) * 100}%`,
                            width: `${100 / analyticsData.speedDistribution.labels.length}%`,
                            height: `${analyticsData.speedDistribution.data[index] * 0.5}%`,
                            backgroundColor: analyticsData.speedDistribution.data[index] > 20 ? '#10b981' :
                                         analyticsData.speedDistribution.data[index] > 10 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-center text-mono-metric-sm text-on-surface-variant mt-2">
                      Download Speed Distribution (Mbps)
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                      <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                        Latency Distribution
                      </span>
                    </div>
                    <div className="bg-surface-container-low h-32 relative">
                      {/* Latency distribution chart */}
                      <div className="absolute inset-0 bg-surface-container-low/20 rounded"></div>
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-tertiary"></div>
                      <div className="absolute left-0 bottom-0 w-1 h-full bg-tertiary"></div>
                      {analyticsData?.latencyDistribution?.labels?.map((_label: any, index: any) => (
                        <div
                          key={index}
                          className="absolute bottom-0"
                          style={{
                            left: `${(index / analyticsData.latencyDistribution.labels.length) * 100}%`,
                            width: `${100 / analyticsData.latencyDistribution.labels.length}%`,
                            height: `${analyticsData.latencyDistribution.data[index] * 0.5}%`,
                            backgroundColor: analyticsData.latencyDistribution.data[index] > 20 ? '#10b981' :
                                         analyticsData.latencyDistribution.data[index] > 10 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-center text-mono-metric-sm text-on-surface-variant mt-2">
                      Latency Distribution (ms)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-4">
            <div className="bg-surface-container rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                  User Management
                </span>
                <span className="ml-auto text-mono-metric-sm text-on-surface-variant">
                  {users.length} users
                </span>
              </div>
              <div className="space-y-3">
                <div className="overflow-y-auto h-40">
                  {users.map((user, _index) => (
                    <div key={user.id} className="bg-surface-container-low rounded p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary-container inline-block"></div>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            User Name
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-on-surface-variant hover:text_on-surface transition-colors"
                            onClick={() => handleDeleteItem('user', user.id, user.name)}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                          {user.name}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Role
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">
                          {user.role}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Campus
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">
                          {user.campus}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">
                            Last Active
                          </span>
                        </div>
                        <span className="font-mono-metric-sm text-on-surface">
                          {user.lastActive}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && itemToDelete && (
        <div className="fixed inset-0 bg-surface-container-low/90 backdrop-blur-xl flex items-center justify-center z-50">
          <div className="bg-surface-container rounded w-96 max-w-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-error flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[24px]">delete</span>
              </div>
              <div className="flex-1">
                <p className="font-headline-sm text-headline-sm text-error">Delete {itemToDelete.type}</p>
                <p className="text-mono-metric-sm text-on-surface-variant">
                  Are you sure you want to delete this {itemToDelete.type.toLowerCase()}? This action cannot be undone.
                  "{itemToDelete.name}" will be permanently removed from the system.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-error text-on-error hover:bg-error/90 transition-colors"
                onClick={handleConfirmDelete}
              >
                Delete {itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
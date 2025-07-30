import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Play, Pause, Square, RotateCcw } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function JobTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [jobName, setJobName] = useState('');
  const [sessions, setSessions] = useState<{name: string, duration: string, timestamp: string}[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (seconds > 0) {
      const session = {
        name: jobName || `Job ${sessions.length + 1}`,
        duration: formatTime(seconds),
        timestamp: new Date().toLocaleString()
      };
      setSessions(prev => [session, ...prev]);
    }
    resetTimer();
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  const clearSessions = () => {
    setSessions([]);
  };

  const copySession = (session: {name: string, duration: string, timestamp: string}) => {
    navigator.clipboard.writeText(`${session.name}: ${session.duration} (${session.timestamp})`);
  };

  const exportSessions = () => {
    const csvContent = "Job Name,Duration,Timestamp\n" + 
      sessions.map(s => `"${s.name}","${s.duration}","${s.timestamp}"`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-timer-sessions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Job Timer - Work Time Tracking Tool for Field Technicians"
        description="Free job timer for field technicians and contractors. Track work time, manage multiple job sessions, and export time records for billing and project management."
        keywords={["job timer", "work timer", "time tracking", "field technician", "contractor timer", "work time tracker", "job duration", "billing timer"]}
        canonicalUrl="/job-timer"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Job Timer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track work time for jobs, projects, and tasks. Perfect for field technicians, contractors, 
          and professionals who need to monitor job duration for billing and project management.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Timer Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="jobName">Job/Task Name (Optional)</Label>
              <Input
                id="jobName"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="e.g., HVAC Repair - Unit 3"
                disabled={isRunning}
              />
            </div>

            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-blue-600 mb-6">
                {formatTime(seconds)}
              </div>
              
              <div className="flex justify-center gap-3">
                {!isRunning ? (
                  <Button
                    onClick={startTimer}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    onClick={pauseTimer}
                    size="lg"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button
                  onClick={stopTimer}
                  size="lg"
                  variant="outline"
                  disabled={seconds === 0}
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop & Save
                </Button>
                
                <Button
                  onClick={resetTimer}
                  size="lg"
                  variant="outline"
                  disabled={isRunning}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              {isRunning ? (
                <span className="text-green-600 font-medium">Timer Running</span>
              ) : seconds > 0 ? (
                <span className="text-yellow-600 font-medium">Timer Paused</span>
              ) : (
                <span className="text-gray-500">Timer Ready</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Session History</span>
              <div className="flex gap-2">
                {sessions.length > 0 && (
                  <>
                    <Button
                      onClick={exportSessions}
                      size="sm"
                      variant="outline"
                    >
                      Export CSV
                    </Button>
                    <Button
                      onClick={clearSessions}
                      size="sm"
                      variant="outline"
                    >
                      Clear All
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No completed sessions yet.</p>
                <p className="text-sm">Start a timer and click "Stop & Save" to record sessions.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sessions.map((session, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{session.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="font-mono font-bold text-blue-600">
                              {session.duration}
                            </span>
                            <span>{session.timestamp}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => copySession(session)}
                          size="sm"
                          variant="ghost"
                          className="ml-2"
                        >
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {sessions.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <strong>Total Sessions:</strong> {sessions.length}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <ShareButtons 
          title="Job Timer - Work Time Tracking Tool"
          description="Free job timer for field technicians and contractors. Track work time and manage multiple job sessions."
        />
      </div>

      <UsageGuide
        title="Job Timer"
        description="Track work time for jobs, projects, and tasks with session history and export capabilities for professional time management."
        examples={[
          {
            title: "Job Time Tracking",
            description: "Enter job name, start timer when work begins, and stop to save the session automatically"
          },
          {
            title: "Multiple Task Management",
            description: "Track different jobs throughout the day with automatic session history and timestamps"
          },
          {
            title: "Export for Billing",
            description: "Export session history as CSV for billing, invoicing, and project time reporting"
          }
        ]}
        tips={[
          "Enter descriptive job names for better organization",
          "Use pause feature for breaks without losing time",
          "Stop and save completes a session and adds it to history",
          "Export sessions regularly for backup and billing"
        ]}
        bestPractices={[
          "Start timer when actual work begins, not travel time",
          "Use consistent naming conventions for similar jobs",
          "Export session data regularly for record keeping",
          "Include job details in the name field for clarity"
        ]}
      />
    </div>
  );
}
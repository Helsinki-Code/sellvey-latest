import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/layout";
import { DotGlobeHero } from "@/components/ui/globe-hero";
import { motion } from "framer-motion";
import { ArrowRight, Zap, BarChart3, TrendingUp, Users, DollarSign, Settings, Bell, Shield, Key, MessageCircle } from "lucide-react";
import { LeadsTable } from "@/components/ui/leads-data-table";
import ProfileCard from "@/components/ui/info-card";
import { RadialOrbitalTimelineDemo } from "@/components/ui/radial-orbital-timeline-demo";
import { Kanban } from "@/components/ui/kanban";
import { ThreeDWallCalendar } from "@/components/ui/three-dwall-calendar";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { FloatingChat } from "@/components/floating-chat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { Login } from "@/components/login";
import { LandingPage } from "@/components/landing-page";
import { GoogleGenAI } from "@google/genai";
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, where } from "firebase/firestore";
import { db } from "@/firebase";
import { handleFirestoreError, OperationType } from "@/lib/firestore-errors";

const pipelineData = [
  { name: "Jan", velocity: 4000, closed: 2400 },
  { name: "Feb", velocity: 3000, closed: 1398 },
  { name: "Mar", velocity: 2000, closed: 9800 },
  { name: "Apr", velocity: 2780, closed: 3908 },
  { name: "May", velocity: 1890, closed: 4800 },
  { name: "Jun", velocity: 2390, closed: 3800 },
  { name: "Jul", velocity: 3490, closed: 4300 },
];

const agentData = [
  { name: "Orchestrator", success: 85, failed: 15 },
  { name: "Market Intel", success: 92, failed: 8 },
  { name: "Prospecting", success: 78, failed: 22 },
];

function DashboardContent() {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "agents"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setAgents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        // Initial seed
        const initialAgents = [
          { name: "Orchestrator", role: "Sales Director", status: "online", avatar: "https://ik.imagekit.io/fpxbgsota/memoji-alex.png?updatedAt=1752933824067", tags: ["Planning", "Active"] },
          { name: "Market Intel", role: "Industry Analyst", status: "online", avatar: "https://ik.imagekit.io/fpxbgsota/memoji-alex.png?updatedAt=1752933824067", tags: ["Researching", "Active"] },
          { name: "Prospecting", role: "Lead Hunter", status: "away", avatar: "https://ik.imagekit.io/fpxbgsota/memoji-alex.png?updatedAt=1752933824067", tags: ["Waiting", "Idle"] },
        ];
        initialAgents.forEach(async (agent) => {
          try {
            await addDoc(collection(db, "agents"), agent);
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, "agents");
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "agents");
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full h-[60vh] min-h-[500px]">
        <DotGlobeHero rotationSpeed={0.004} className="bg-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          <div className="relative z-10 text-center space-y-8 max-w-5xl mx-auto px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] select-none ethereal-text">
                <span className="block font-light text-foreground/70 mb-3 text-4xl md:text-5xl">
                  Welcome to
                </span>
                <span className="bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent font-black relative z-10">
                  NEXUS COMMAND
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto ethereal-text">
                Your living, breathing AI sales command center. Working while you watch.
              </p>
            </motion.div>
          </div>
        </DotGlobeHero>
      </div>

      <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="liquid-panel rounded-2xl p-1">
              <ProfileCard
                name={agent.name}
                role={agent.role}
                status={agent.status}
                avatar={agent.avatar}
                tags={agent.tags}
                isVerified={true}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 liquid-panel rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 tracking-tight ethereal-text">Active Leads</h2>
          <LeadsTable />
        </div>

        <div className="mt-8 liquid-panel rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 tracking-tight ethereal-text">Operation Timeline</h2>
          <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/20 relative">
            <RadialOrbitalTimelineDemo />
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarContent() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "events"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(loadedEvents);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "events");
    });
    return () => unsubscribe();
  }, []);

  const suggestMeetingTime = async () => {
    setIsSuggesting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Based on these existing events: ${JSON.stringify(events)}, suggest an optimal 30-minute meeting time for tomorrow between 9 AM and 5 PM. Provide only the time and a brief reason.`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setSuggestion(response.text || "No suggestion available.");
    } catch (error) {
      console.error("Error suggesting meeting time:", error);
      setSuggestion("Failed to get suggestion.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const addEvent = async (ev: any) => {
    try {
      await addDoc(collection(db, "events"), {
        title: ev.title,
        date: ev.date
      });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const removeEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight ethereal-text">Meeting Scheduler</h1>
          <p className="text-muted-foreground text-lg ethereal-text">Manage your team's upcoming calls and demos.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button 
            onClick={suggestMeetingTime} 
            disabled={isSuggesting}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
          >
            {isSuggesting ? "Analyzing..." : "AI Suggest Time"}
          </Button>
          {suggestion && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm bg-white/5 border border-white/10 p-3 rounded-xl max-w-xs ethereal-text"
            >
              <span className="font-bold text-primary">Suggestion:</span> {suggestion}
            </motion.div>
          )}
        </div>
      </div>
      <ThreeDWallCalendar events={events} onAddEvent={addEvent} onRemoveEvent={removeEvent} />
    </div>
  );
}

function TasksContent() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-8 pb-0 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight ethereal-text">Tasks & Approvals</h1>
          <p className="text-muted-foreground text-lg ethereal-text">Review and approve agent actions.</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Kanban />
      </div>
    </div>
  );
}

function AnalyticsContent() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "leads"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedLeads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(loadedLeads);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "leads");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate dynamic stats
  const totalRevenue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const activeProspects = leads.filter(l => l.status !== 'Closed Won' && l.status !== 'Closed Lost').length;
  const closedWon = leads.filter(l => l.status === 'Closed Won').length;
  const conversionRate = leads.length > 0 ? ((closedWon / leads.length) * 100).toFixed(1) : "0.0";
  
  // Calculate pipeline data based on lead creation dates
  const pipelineDataMap = new Map();
  leads.forEach(lead => {
    if (lead.createdAt) {
      const date = new Date(lead.createdAt.toMillis());
      const month = date.toLocaleString('default', { month: 'short' });
      if (!pipelineDataMap.has(month)) {
        pipelineDataMap.set(month, { name: month, velocity: 0, closed: 0 });
      }
      const data = pipelineDataMap.get(month);
      data.velocity += lead.value || 0;
      if (lead.status === 'Closed Won') {
        data.closed += lead.value || 0;
      }
    }
  });
  const dynamicPipelineData = Array.from(pipelineDataMap.values());
  // Fallback if no data
  const finalPipelineData = dynamicPipelineData.length > 0 ? dynamicPipelineData : [
    { name: "Jan", velocity: 4000, closed: 2400 },
    { name: "Feb", velocity: 3000, closed: 1398 },
    { name: "Mar", velocity: 2000, closed: 9800 },
  ];

  const dynamicAgentData = [
    { name: "Orchestrator", success: 85, failed: 15 },
    { name: "Market Intel", success: 92, failed: 8 },
    { name: "Prospecting", success: 78, failed: 22 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight ethereal-text">Analytics Overview</h1>
        <p className="text-muted-foreground text-lg ethereal-text">Real-time insights into your AI sales performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Pipeline Value", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "Based on all leads" },
          { title: "Active Prospects", value: activeProspects.toString(), icon: Users, trend: "Currently in pipeline" },
          { title: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, trend: "Closed Won / Total" },
          { title: "Total Leads", value: leads.length.toString(), icon: BarChart3, trend: "All time" },
        ].map((stat, i) => (
          <Card key={i} className="liquid-panel bg-transparent border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium ethereal-text">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary ethereal-text" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ethereal-text">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 ethereal-text">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="liquid-panel bg-transparent border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-2xl">
          <CardHeader>
            <CardTitle className="ethereal-text">Pipeline Velocity</CardTitle>
            <CardDescription className="ethereal-text">Value created vs closed by month</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finalPipelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="velocity" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVelocity)" />
                <Area type="monotone" dataKey="closed" stroke="hsl(var(--secondary))" fillOpacity={1} fill="url(#colorClosed)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="liquid-panel bg-transparent border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-2xl">
          <CardHeader>
            <CardTitle className="ethereal-text">Agent Performance</CardTitle>
            <CardDescription className="ethereal-text">Success rate by AI agent</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicAgentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} cursor={{fill: 'hsl(var(--muted))'}} />
                <Bar dataKey="success" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                <Bar dataKey="failed" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsContent() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "feedback"), {
        content: feedback,
        timestamp: new Date().toISOString(),
      });
      setFeedback("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight ethereal-text">Settings</h1>
        <p className="text-muted-foreground text-lg ethereal-text">Manage your account and AI preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card className="liquid-panel bg-transparent border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ethereal-text"><Settings className="w-5 h-5 text-primary" /> General Preferences</CardTitle>
            <CardDescription className="ethereal-text">Configure your workspace settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium ethereal-text">Workspace Name</label>
              <Input defaultValue="Acme Corp Sales" className="bg-white/5 border-white/10 ethereal-text focus-visible:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium ethereal-text">Primary Industry</label>
              <Input defaultValue="SaaS / Technology" className="bg-white/5 border-white/10 ethereal-text focus-visible:ring-primary/50" />
            </div>
            <Button className="bg-primary/80 hover:bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)]">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="liquid-panel bg-transparent border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ethereal-text"><MessageCircle className="w-5 h-5 text-primary" /> Feedback & Support</CardTitle>
            <CardDescription className="ethereal-text">Report issues or suggest improvements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium ethereal-text">Your Message</label>
                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Describe your issue or suggestion..."
                  className="w-full min-h-[100px] rounded-md bg-white/5 border border-white/10 p-3 ethereal-text focus-visible:ring-primary/50 outline-none"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !feedback.trim()}
                className="bg-primary/80 hover:bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)]"
              >
                {isSubmitting ? "Submitting..." : submitted ? "Thank you!" : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="liquid-panel bg-transparent border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ethereal-text"><Key className="w-5 h-5 text-primary" /> API Integrations</CardTitle>
            <CardDescription className="ethereal-text">Connect your external tools and services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium ethereal-text">Salesforce API Key</label>
              <Input type="password" placeholder="••••••••••••••••" className="bg-white/5 border-white/10 ethereal-text focus-visible:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium ethereal-text">HubSpot Token</label>
              <Input type="password" placeholder="••••••••••••••••" className="bg-white/5 border-white/10 ethereal-text focus-visible:ring-primary/50" />
            </div>
            <Button variant="outline" className="border-white/20 hover:bg-white/10 ethereal-text">Update Keys</Button>
          </CardContent>
        </Card>

        <Card className="liquid-panel bg-transparent border-destructive/20 shadow-[0_0_15px_rgba(220,38,38,0.1)] rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive ethereal-text"><Shield className="w-5 h-5" /> Danger Zone</CardTitle>
            <CardDescription className="ethereal-text">Irreversible actions for your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="shadow-[0_0_15px_rgba(220,38,38,0.4)]">Delete Workspace</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    if (showLogin) {
      return (
        <div className="relative">
          <button 
            onClick={() => setShowLogin(false)}
            className="absolute top-8 left-8 z-50 text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            ← Back to Nexus
          </button>
          <Login />
        </div>
      );
    }
    return <LandingPage onGetStarted={() => setShowLogin(true)} />;
  }

  return (
    <AppLayout>
      {(activeSection) => {
        if (activeSection === "dashboard") return <DashboardContent />;
        if (activeSection === "calendar") return <CalendarContent />;
        if (activeSection === "tasks") return <TasksContent />;
        if (activeSection === "analytics") return <AnalyticsContent />;
        if (activeSection === "settings") return <SettingsContent />;
        return <DashboardContent />;
      }}
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <AppContent />
        <FloatingChat />
      </AuthProvider>
    </ThemeProvider>
  );
}


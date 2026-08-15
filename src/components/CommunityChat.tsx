import React, { useState } from 'react';
import { Calendar, ExternalLink, Slack, MapPin, Video, CheckCircle, Plus, Users, Clock, Sparkles, X, ChevronRight } from 'lucide-react';

interface CommunityChatProps {
  category: 'Environment' | 'Well-Being' | 'Compassion' | 'Responsible AI';
  goalTitle: string;
  theme?: 'dark' | 'light';
}

interface CalendarEvent {
  id: string;
  title: string;
  badge: string;
  badgeColor: string; // Tailwind bg class
  dateFormatted: string; // e.g. 'Thu, 6:00 PM · Online'
  dateTimeLocation: string; // e.g. 'Thu, 6:00 PM · Online'
  fullDate: string;
  time: string;
  location: string;
  isOnline: boolean;
  googleMeetUrl?: string;
  googleCalendarUrl: string;
  attendees: number;
  description: string;
  hostName: string;
}

export default function CommunityChat({ category, goalTitle, theme = 'light' }: CommunityChatProps) {
  const [rsvpedEvents, setRsvpedEvents] = useState<Record<string, boolean>>({});
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Digital' | 'In-Person'>('All');

  const slackChannelName = {
    'Environment': 'hbw-climate-action',
    'Well-Being': 'hbw-vitality-circle',
    'Compassion': 'hbw-kindness-ripple',
    'Responsible AI': 'hbw-responsible-ai'
  }[category] || 'hbw-global';

  const slackWorkspaceUrl = `https://slack.com/app_redirect?channel=${slackChannelName}`;

  // Shared Google Calendar ID for Habits for a Better World community
  const sharedCalendarId = 'c_habitsforabetterworld@group.calendar.google.com';
  const sharedCalendarWebUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(sharedCalendarId)}`;

  // Curated events matching the clean Google Calendar event card structure
  const googleCalendarEvents: CalendarEvent[] = [
    {
      id: 'evt-1',
      title: 'Live Q&A: habits that stick',
      badge: 'Digital Events',
      badgeColor: 'bg-[#E65100]',
      dateFormatted: 'Thu, 6:00 PM · Online',
      dateTimeLocation: 'Thu, 6:00 PM · Online',
      fullDate: 'Thursday, Aug 21',
      time: '6:00 PM - 7:00 PM EST',
      location: 'Google Meet (Live Video)',
      isOnline: true,
      googleMeetUrl: 'https://meet.google.com/hbw-live-habits',
      googleCalendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Live+Q%26A:+habits+that+stick&details=Interactive+live+session+on+building+sustainable+positive+habits+with+behavioral+science.&location=https://meet.google.com/hbw-live-habits',
      attendees: 142,
      description: 'Join behavioral designers and peer challengers for a candid Q&A on eliminating habit friction, maintaining streaks through busy weeks, and compounding impact.',
      hostName: 'Nathan & HBW Facilitators'
    },
    {
      id: 'evt-2',
      title: 'Global Habit Accountability Circle',
      badge: 'Digital Events',
      badgeColor: 'bg-[#0080FF]',
      dateFormatted: 'Tomorrow, 6:00 PM · Online',
      dateTimeLocation: 'Tomorrow, 6:00 PM · Online',
      fullDate: 'Tomorrow, Aug 16',
      time: '6:00 PM - 7:00 PM EST',
      location: 'Google Meet',
      isOnline: true,
      googleMeetUrl: 'https://meet.google.com/abc-defg-hij',
      googleCalendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Global+Habit+Accountability+Circle&details=Join+the+weekly+Habits+for+a+Better+World+accountability+circle.&location=https://meet.google.com/abc-defg-hij',
      attendees: 128,
      description: 'Weekly check-in circle to share weekly progress, celebrate milestone achievements, and problem-solve hurdles with fellow participants.',
      hostName: 'Community Leads'
    },
    {
      id: 'evt-3',
      title: 'Local Park Clean-Up & Tree Planting',
      badge: 'In-Person',
      badgeColor: 'bg-[#16A34A]',
      dateFormatted: 'Sat, 10:00 AM · Central Park',
      dateTimeLocation: 'Sat, 10:00 AM · Central Community Park (North Gate)',
      fullDate: 'Saturday, Aug 23',
      time: '10:00 AM - 12:30 PM EST',
      location: 'Central Community Park (North Gate entrance)',
      isOnline: false,
      googleCalendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Local+Park+Clean-Up+%26+Native+Tree+Planting&details=Community+eco+action+day.+Gloves+and+seedlings+provided.&location=Central+Community+Park',
      attendees: 42,
      description: 'Hands-on environmental action: native planting, trail maintenance, and cleanup. Gardening gloves and refreshments provided.',
      hostName: 'EcoAction Team'
    },
    {
      id: 'evt-4',
      title: 'Neighborhood Seed & Plant Swap',
      badge: 'Local Meetup',
      badgeColor: 'bg-[#0D9488]',
      dateFormatted: 'Sun, 2:00 PM · Pavilion',
      dateTimeLocation: 'Sun, 2:00 PM · Greenhouse Community Pavilion',
      fullDate: 'Sunday, Aug 24',
      time: '2:00 PM - 4:00 PM EST',
      location: 'Greenhouse Community Pavilion, Garden Room',
      isOnline: false,
      googleCalendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Neighborhood+Seed+%26+Plant+Swap&details=Bring+seeds+or+cuttings+to+swap.&location=Greenhouse+Community+Pavilion',
      attendees: 29,
      description: 'Exchange homegrown herb seeds, organic produce cuttings, and practical soil care tips with local neighbors and garden enthusiasts.',
      hostName: 'Green Neighborhood Hub'
    }
  ];

  const filteredEvents = googleCalendarEvents.filter(evt => {
    if (activeFilter === 'Digital') return evt.isOnline;
    if (activeFilter === 'In-Person') return !evt.isOnline;
    return true;
  });

  const toggleRsvp = (eventId: string) => {
    setRsvpedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <div className={`flex flex-col gap-4 w-full transition-colors duration-200 ${
      theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
    }`}>
      {/* 1. Slack Workspace Direct Link Card (Sleek, Uncrowded) */}
      <div className={`p-4 border rounded-[16px] shadow-xs transition-all ${
        theme === 'dark' 
          ? 'bg-[#121214] border-[#1F1F24]' 
          : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#4A154B] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Slack className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs sm:text-sm font-bold leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                Community Slack
              </h4>
              <p className={`text-[11px] mt-0.5 leading-tight ${
                theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                Connect live in <span className="font-semibold text-[#0080FF]">#{slackChannelName}</span>
              </p>
            </div>
          </div>

          <a
            href={slackWorkspaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#4A154B] hover:bg-[#5B1A5C] active:scale-95 text-white font-semibold text-xs rounded-full transition-all shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>Open Slack</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. Events Header with Filter Pills */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0080FF]" />
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8E93]">
              Community Calendar Events
            </h4>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            {(['All', 'Digital', 'In-Person'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[#1C1C1E] text-white dark:bg-white dark:text-black font-semibold'
                    : theme === 'dark'
                    ? 'bg-[#1F1F24] text-[#98989D] hover:text-white'
                    : 'bg-[#F2F2F7] text-[#6C6C70] hover:text-[#1C1C1E]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Event Cards — Clean, Airy Google Calendar Style with standard tab font sizes */}
        <div className="space-y-2.5">
          {filteredEvents.map((evt) => {
            const isRsvped = !!rsvpedEvents[evt.id];
            return (
              <div
                key={evt.id}
                className={`p-4 border rounded-[16px] shadow-xs transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-[#121214] border-[#1F1F24] hover:border-[#2E2E35]'
                    : 'bg-white border-[#E5E5EA] hover:border-[#D1D1D6]'
                }`}
              >
                {/* Top Row: Pill Tag (Left) & Date/Time (Right) */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-white rounded-full ${evt.badgeColor}`}>
                    {evt.badge}
                  </span>
                  <span className="text-[11px] font-normal text-[#8E8E93]">
                    {evt.dateFormatted}
                  </span>
                </div>

                {/* Middle: Title & Subtitle */}
                <div className="mt-2.5 mb-3">
                  <h4 className={`text-xs sm:text-sm font-bold leading-tight ${
                    theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
                  }`}>
                    {evt.title}
                  </h4>
                  <p className="text-[11px] leading-normal mt-1 text-[#8E8E93]">
                    {evt.dateTimeLocation}
                  </p>
                </div>

                {/* Bottom Row: RSVP Details Link (Left) & RSVP Button (Right) */}
                <div className="flex items-center justify-between pt-0.5">
                  <button
                    onClick={() => setSelectedEvent(evt)}
                    className="text-xs font-semibold text-[#0080FF] hover:underline cursor-pointer transition-colors"
                  >
                    RSVP Details
                  </button>

                  <button
                    onClick={() => toggleRsvp(evt.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isRsvped
                        ? 'bg-[#34C759] text-white shadow-xs'
                        : theme === 'dark'
                        ? 'bg-white text-black hover:bg-[#E5E5EA]'
                        : 'bg-[#1C1C1E] hover:bg-black text-white'
                    }`}
                  >
                    {isRsvped && <CheckCircle className="w-3.5 h-3.5" />}
                    <span>{isRsvped ? 'Attending' : 'RSVP'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Event RSVP Details Modal (Clean, Informative) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md p-5 rounded-[20px] border shadow-xl transition-all ${
              theme === 'dark' ? 'bg-[#18181B] border-[#2A2A30] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EBEBEF] dark:border-[#27272A]">
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-white rounded-full ${selectedEvent.badgeColor}`}>
                  {selectedEvent.badge}
                </span>
                <h3 className="text-sm sm:text-base font-bold mt-1.5 leading-snug">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className={`p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer ${
                  theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-3.5 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-[#0080FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">{selectedEvent.fullDate}</span>
                  <span className={`text-[11px] ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                    {selectedEvent.time}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                {selectedEvent.isOnline ? (
                  <Video className="w-3.5 h-3.5 text-[#0080FF] shrink-0 mt-0.5" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#E65100] shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-semibold block">{selectedEvent.location}</span>
                  {selectedEvent.googleMeetUrl && (
                    <a
                      href={selectedEvent.googleMeetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#0080FF] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      Join Google Meet room <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Users className="w-3.5 h-3.5 text-[#34C759] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">
                    {selectedEvent.attendees + (rsvpedEvents[selectedEvent.id] ? 1 : 0)} Participants Confirmed
                  </span>
                  <span className={`text-[11px] ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                    Hosted by {selectedEvent.hostName}
                  </span>
                </div>
              </div>

              <p className={`text-[11px] leading-relaxed pt-2 border-t border-[#EBEBEF] dark:border-[#27272A] ${
                theme === 'dark' ? 'text-[#A1A1AA]' : 'text-[#6C6C70]'
              }`}>
                {selectedEvent.description}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-[#EBEBEF] dark:border-[#27272A]">
              <a
                href={selectedEvent.googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                  theme === 'dark'
                    ? 'border-[#33333A] hover:bg-[#27272A] text-[#98989D] hover:text-white'
                    : 'border-[#E5E5EA] hover:bg-[#F2F2F7] text-[#6C6C70] hover:text-black'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </a>

              <button
                onClick={() => {
                  toggleRsvp(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  rsvpedEvents[selectedEvent.id]
                    ? 'bg-[#34C759] text-white'
                    : theme === 'dark'
                    ? 'bg-white text-black hover:bg-[#E5E5EA]'
                    : 'bg-[#1C1C1E] hover:bg-black text-white'
                }`}
              >
                {rsvpedEvents[selectedEvent.id] ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Attending</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>RSVP Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

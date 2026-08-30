import Link from 'next/link';
import { ArrowRight, Activity, MapPin, ShieldCheck, Stethoscope, Users, HeartPulse, BellRing, Search, Droplets } from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'Donors' },
  { value: '5,000+', label: 'Lives Supported' },
  { value: '100+', label: 'Cities' },
];

const quickActions = [
  { title: 'Find a Donor', description: 'Search verified donors by blood group and city.', icon: Search },
  { title: 'Request Blood', description: 'Tell your community what you need.', icon: Droplets },
  { title: 'Become a Donor', description: 'Register and help someone when it matters most.', icon: HeartPulse },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const steps = [
  { step: 'STEP 01', title: 'Register', description: 'Create a secure account and blood profile.' },
  { step: 'STEP 02', title: 'Find / Request', description: 'Search donors or create a blood request.' },
  { step: 'STEP 03', title: 'Connect', description: 'Send help requests through the platform.' },
  { step: 'STEP 04', title: 'Help', description: 'Coordinate with hospitals and donors safely.' },
];

const emergencyRequests = [
  { bloodGroup: 'O+', city: 'Lucknow', hospital: 'King George Medical University', units: 2, reqBy: 'Today, 8:00 PM', urgency: 'CRITICAL' },
  { bloodGroup: 'B+', city: 'Kanpur', hospital: 'Regency Hospital', units: 4, reqBy: 'Tomorrow, 11:30 AM', urgency: 'URGENT' },
  { bloodGroup: 'AB-', city: 'Varanasi', hospital: 'Heritage Hospital', units: 3, reqBy: 'Today, 5:15 PM', urgency: 'CRITICAL' },
];

const faqs = [
  { question: 'How does RAKTA protect donor privacy?', answer: 'RAKTA never publicly reveals private addresses, emails, exact home location, or government IDs. Contact happens through an authorized platform request flow.' },
  { question: 'Is this a medical replacement?', answer: 'No. RAKTA supports connection and matching, but the actual medical decision rests with hospitals, blood banks, and qualified professionals.' },
  { question: 'How are donors verified?', answer: 'Donor profiles can be verified by admins, and all users are encouraged to update contact and eligibility information responsibly.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="container-shell flex flex-col items-center gap-5 py-6">
          <div className="header-drop-mark">
            <div className="blood-bag-logo" aria-label="RAKTA Uttar Pradesh Blood Network">
              <span className="blood-bag-tube" />
              <span className="blood-bag-drop" />
              <div className="blood-bag">
                <span className="blood-bag-cap" />
                <span className="blood-bag-fluid" />
                <strong>RAKTA</strong>
                <small>BLOOD NETWORK</small>
              </div>
            </div>
            <div className="header-tagline">Uttar Pradesh Blood Network</div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-200">
            <Link href="/find-donor">Find Donor</Link>
            <Link href="/request-blood">Request Blood</Link>
            <Link href="/donate">Become a Donor</Link>
            <Link href="/emergency">Emergency</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-secondary">Login</Link>
            <Link href="/auth/register" className="btn-primary">Register</Link>
          </div>
        </div>
      </header>

      <section className="container-shell relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.16),transparent_35%)]" />
        <div className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:col-span-2">
            <div className="mb-5 inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-red-200">
              <BellRing className="h-3.5 w-3.5" />
              Community-powered care
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white md:text-7xl">
              Every Drop<br />Can Change<br />A Life.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Find a blood donor near you, become a donor, or request urgent help from your community.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/find-donor" className="btn-primary">Find a Donor <ArrowRight className="ml-2 h-4 w-4" /></Link>
              <Link href="/donate" className="btn-secondary">Become a Donor</Link>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="panel p-4">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-3xl">
            <div className="panel relative overflow-hidden p-5 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.26),transparent_30%)]" />
              <div className="relative z-10 grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Live Donation Network</div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                    <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" /> Available
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Nearby Need</div>
                      <div className="mt-2 text-3xl font-black text-red-400">O+</div>
                    </div>
                    <div className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-red-200">Critical</div>
                  </div>

                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-center justify-between"><span>City</span><strong className="text-white">Lucknow, UP</strong></div>
                    <div className="flex items-center justify-between"><span>Hospital</span><strong className="text-white">King George</strong></div>
                    <div className="flex items-center justify-between"><span>Units</span><strong className="text-white">2 units</strong></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {['A+', 'B+', 'AB+', 'O-'].map((group) => (
                    <div key={group} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Blood</div>
                      <div className="mt-2 text-2xl font-black text-red-400">{group}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="container-shell pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {quickActions.map(({ title, description, icon: Icon }) => (
            <Link key={title} href={title === 'Find a Donor' ? '/find-donor' : title === 'Request Blood' ? '/request-blood' : '/donate'} className="panel group relative overflow-hidden p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent" />
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-black uppercase tracking-[-0.04em] text-white">{title}</div>
              <p className="mt-3 text-sm text-slate-300">{description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-200">
                Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-red-300">Live Blood Need</div>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">Urgent Requests</h2>
          </div>
          <Link href="/emergency" className="text-sm font-semibold text-red-200">View all</Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {emergencyRequests.map((request) => (
            <div key={`${request.city}-${request.bloodGroup}`} className="panel p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-200">{request.urgency}</span>
                <span className="text-sm text-slate-300">{request.bloodGroup}</span>
              </div>
              <div className="space-y-3 text-sm text-slate-200">
                <div className="flex items-center justify-between"><span>City</span><strong>{request.city}</strong></div>
                <div className="flex items-center justify-between"><span>Hospital</span><strong>{request.hospital}</strong></div>
                <div className="flex items-center justify-between"><span>Units</span><strong>{request.units}</strong></div>
                <div className="flex items-center justify-between"><span>Required By</span><strong>{request.reqBy}</strong></div>
              </div>
              <button className="btn-primary mt-6 w-full">Help this request</button>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.25em] text-red-300">Blood Group Explorer</div>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">Find your match</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bloodGroups.map((group) => (
            <Link key={group} href={`/find-donor?bloodGroup=${group}`} className="panel p-6 transition hover:-translate-y-1 hover:border-red-500/40 hover:shadow-glow">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Blood Group</div>
              <div className="mt-4 text-4xl font-black text-red-400">{group}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-red-300">How It Works</div>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">Simple, safe, and community-first</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {steps.map(({ step, title, description }, index) => (
            <div key={step} className="panel p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-red-200">{step}</div>
              <div className="mt-4 text-xl font-black text-white">{title}</div>
              <p className="mt-2 text-sm text-slate-300">{description}</p>
              <div className="mt-4 text-3xl font-black text-red-400">0{index + 1}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {[
            { icon: Users, title: 'Verified community', value: '10k+' },
            { icon: Activity, title: 'Requests fulfilled', value: '5k+' },
            { icon: ShieldCheck, title: 'Safety-first platform', value: '24/7' },
          ].map(({ icon: Icon, title, value }) => (
            <div key={title} className="panel p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-300">
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-5 text-3xl font-black text-white">{value}</div>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-300">{title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-red-300">Become a donor</div>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] text-white">One act of kindness can save multiple lives</h2>
            </div>
            <Link href="/donate" className="btn-primary">Join the mission</Link>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-red-300">Trust & Safety</div>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">We keep the process safe, transparent, and respectful</h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 text-red-300" />We connect people through a secure, privacy-first request flow.</li>
              <li className="flex gap-3"><Stethoscope className="mt-1 h-5 w-5 text-red-300" />The final medical decision belongs to hospitals, blood banks, and qualified healthcare professionals.</li>
              <li className="flex gap-3"><MapPin className="mt-1 h-5 w-5 text-red-300" />The platform avoids exposing private addresses or personal records publicly.</li>
            </ul>
          </div>

          <div className="panel p-7">
            <div className="text-xs uppercase tracking-[0.2em] text-red-300">FAQ</div>
            <div className="mt-5 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white">{faq.question}</div>
                  <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="container-shell grid gap-8 py-12 md:grid-cols-4">
          <div>
            <div className="text-2xl font-black tracking-[0.2em] text-white">RAKTA</div>
            <p className="mt-4 text-sm text-slate-300">Connecting donors with people who need help.</p>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Platform</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><Link href="/find-donor">Find Donor</Link></li>
              <li><Link href="/request-blood">Request Blood</Link></li>
              <li><Link href="/donate">Become a Donor</Link></li>
              <li><Link href="/emergency">Emergency</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Resources</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><Link href="/about">How It Works</Link></li>
              <li><Link href="/blood-groups">Blood Groups</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/privacy">Safety</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Legal</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/community-guidelines">Community Guidelines</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
          © 2026 RAKTA. One Donation. One Life. One Community.
        </div>
      </footer>
    </main>
  );
}

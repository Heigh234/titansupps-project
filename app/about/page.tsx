import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dumbbell, Zap, Shield, Star, Target, Award,
  FlaskConical, Leaf, Users, TrendingUp, ArrowRight, CheckCircle
} from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const metadata = {
  title: 'About Us | TitanSupps',
  description: 'Learn about the story and mission behind TitanSupps.',
}

export default async function AboutPage() {
  const session = await getServerSession(authOptions)
  return (
    <main className="min-h-screen pt-20 overflow-hidden">

      {/* ─── HERO ─── */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon/8 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          {/* Label */}
          <div className="inline-flex items-center gap-2 border border-neon/30 bg-neon/10 rounded-full px-4 py-2 mb-8">
            <Dumbbell className="w-4 h-4 text-neon" />
            <span className="text-neon text-sm font-bold uppercase tracking-widest">Our Story</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
            BUILT FOR
            <br />
            <span className="text-gradient">CHAMPIONS</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We're not just another supplement brand. We are the result of years of
            research, gym failures and a relentless obsession
            with excellence.
          </p>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="border-y border-border bg-card/50 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '50K+', label: 'Active athletes', icon: Users },
            { value: '98%', label: 'Satisfaction', icon: Star },
            { value: '7+', label: 'Years in the market', icon: Award },
            { value: '100%', label: 'Natural ingredients', icon: Leaf },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <stat.icon className="w-6 h-6 text-neon mx-auto" />
              <div className="text-4xl font-black text-neon">{stat.value}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MISSION ─── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 border border-neon/30 bg-neon/10 rounded-full px-4 py-2">
              <Target className="w-4 h-4 text-neon" />
              <span className="text-neon text-sm font-bold uppercase tracking-widest">Our Mission</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              PERFORMANCE WITHOUT
              <br />
              <span className="text-gradient">COMPROMISE</span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              From day one, our mission was clear: create supplements
              that actually work. No fillers, no tricks, no
              second-rate ingredients.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Every formula is developed alongside sports nutritionists and
              elite athletes. Because if we wouldn't use it ourselves,
              we don't sell it.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Science-backed formulas',
                'No artificial colors or fillers',
                'Tested by professional athletes',
                'Certified by independent labs',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-neon flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-neon/5 rounded-3xl blur-xl" />
            <div className="relative glass rounded-2xl p-10 space-y-8 border border-neon/20">
              <div className="w-16 h-16 bg-neon rounded-2xl flex items-center justify-center">
                <Dumbbell className="w-9 h-9 text-background" />
              </div>
              <blockquote className="text-2xl font-bold leading-snug">
                "The limit is not in your muscles.
                <span className="text-neon"> It's in what you give your body."</span>
              </blockquote>
              <div className="border-t border-border pt-6">
                <p className="font-bold text-white">TitanSupps Team</p>
                <p className="text-sm text-gray-400">Founded by athletes, for athletes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALORES ─── */}
      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 border border-neon/30 bg-neon/10 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-neon" />
              <span className="text-neon text-sm font-bold uppercase tracking-widest">Our Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black">
              WHAT <span className="text-gradient">DEFINES US</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FlaskConical,
                title: 'Science first',
                desc: 'Every ingredient has a reason to be in our formulas. Clinical dosages, not label doses for marketing.',
              },
              {
                icon: Shield,
                title: 'Full transparency',
                desc: 'No proprietary blends, no hidden ingredients. You know exactly what you\'re putting in your body and how much.',
              },
              {
                icon: TrendingUp,
                title: 'Real results',
                desc: 'We don\'t sell promises. We sell products that thousands of athletes already use and have proven to work.',
              },
              {
                icon: Leaf,
                title: 'Natural and clean',
                desc: 'Ingredients of the highest purity, no artificial colors, no hidden sugars, no cheap fillers.',
              },
              {
                icon: Users,
                title: 'Athletic community',
                desc: 'We\'re more than a store. We\'re a community of people committed to taking their performance to the next level.',
              },
              {
                icon: Zap,
                title: 'Constant innovation',
                desc: 'Sports evolve, science advances. Our formulas are updated to always stay at the cutting edge.',
              },
            ].map((val, i) => (
              <div
                key={i}
                className="card p-8 hover:border-neon/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-neon/10 border border-neon/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-neon/20 transition-colors">
                  <val.icon className="w-6 h-6 text-neon" />
                </div>
                <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESO ─── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 border border-neon/30 bg-neon/10 rounded-full px-4 py-2 mb-6">
              <FlaskConical className="w-4 h-4 text-neon" />
              <span className="text-neon text-sm font-bold uppercase tracking-widest">Our Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black">
              FROM THE LAB TO YOUR <span className="text-gradient">TRAINING</span>
            </h2>
          </div>

          <div className="relative space-y-0">
            {/* Vertical line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-neon via-neon/50 to-transparent hidden md:block" />

            {[
              { step: '01', title: 'Research', desc: 'We analyze the latest scientific evidence and work with sports nutrition experts.' },
              { step: '02', title: 'Formulation', desc: 'We develop formulas with effective dosages, without compromising quality for cost.' },
              { step: '03', title: 'Testing', desc: 'Every batch is tested in a certified independent lab before reaching production.' },
              { step: '04', title: 'Beta athletes', desc: 'Real athletes test the products and give us feedback for final adjustments.' },
              { step: '05', title: 'Your training', desc: 'The product reaches your hands ready to help you break your limits.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 pb-10 relative">
                <div className="flex-shrink-0 w-12 h-12 bg-neon rounded-full flex items-center justify-center font-black text-background text-sm z-10">
                  {item.step}
                </div>
                <div className="pt-2 pb-4">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative glass rounded-3xl p-12 text-center border border-neon/20 overflow-hidden">
            <div className="absolute inset-0 bg-neon/5 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon/10 rounded-full blur-[80px]" />

            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-neon rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-9 h-9 text-background" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black">
                READY TO
                <br />
                <span className="text-gradient">ELEVATE YOUR GAME?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Join over 50,000 athletes who already trust TitanSupps to
                reach their peak performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link href="/products">
                  <Button size="lg" className="btn-primary text-lg px-10 py-6 gap-2">
                    Shop products <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                {!session && (
                  <Link href="/auth/register">
                    <Button size="lg" variant="outline" className="btn-secondary text-lg px-10 py-6">
                      Create free account
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

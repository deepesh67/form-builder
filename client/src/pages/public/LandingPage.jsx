import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layout, BarChart3, Zap, ShieldCheck, Globe } from 'lucide-react';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative isolate pt-14 overflow-hidden">
      {/* Background Gradients */}
      <div className="neo-blur bg-brand-500 w-[500px] h-[500px] -top-40 -right-40" />
      <div className="neo-blur bg-purple-500 w-[400px] h-[400px] top-1/2 -left-40" />

      {/* Hero Section */}
      <div className="py-24 sm:py-32 lg:pb-40">
        <motion.div 
          className="mx-auto max-w-7xl px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-500 ring-1 ring-slate-900/10 hover:ring-slate-900/20 dark:text-slate-400 dark:ring-white/10 dark:hover:ring-white/20">
              Introducing Version 2.0. <Link to="/register" className="font-semibold text-brand-500"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-8">
            Build Stunning Forms <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">In Seconds</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            The no-code form builder for modern teams. Create complex layouts, track conversions, and integrate with your favorite tools—all from one beautiful dashboard.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/register" className="btn-premium btn-premium-primary text-lg">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
              Sign in <span aria-hidden="true">→</span>
            </Link>
          </motion.div>

          {/* Floating UI Mockup */}
          <motion.div 
            variants={itemVariants} 
            className="mt-16 flow-root sm:mt-24 relative p-2 bg-white/5 dark:bg-white/5 rounded-2xl ring-1 ring-white/10"
          >
            <div className="rounded-xl bg-slate-900/10 dark:bg-black/40 ring-1 ring-slate-900/5 dark:ring-white/10 shadow-2xl overflow-hidden glass">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-white/5 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="w-64 h-5 bg-white/10 rounded-lg" />
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                alt="App screenshot"
                className="w-full h-auto opacity-80"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {[
              { name: 'Drag & Drop', description: 'Simple, powerful interface to build complex forms visually.', icon: Layout },
              { name: 'Smart Analytics', description: 'Track every interaction, drop-off, and conversion in real-time.', icon: BarChart3 },
              { name: 'Instant Deploy', description: 'Share your forms instantly with unique, beautiful public URLs.', icon: Zap },
            ].map((feature) => (
              <motion.div 
                key={feature.name} 
                whileHover={{ y: -5 }}
                className="flex flex-col glass-card p-8 rounded-3xl"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white shadow-lg shadow-brand-600/30">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <dt className="text-xl font-bold leading-7 text-slate-900 dark:text-white">
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

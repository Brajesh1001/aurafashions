import { useState, useEffect } from 'react'
import { Clock, Mail, Bell, ArrowRight, CheckCircle2, AlertCircle, Instagram } from 'lucide-react'
import emailjs from '@emailjs/browser'
import logo from '../assets/aura.png'

const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-aura-gold/30 rounded-2xl p-4 min-w-[100px] sm:min-w-[120px] transition-all hover:scale-105 hover:border-aura-gold hover:shadow-lg hover:shadow-aura-gold/10 duration-300">
        <span className="text-3xl sm:text-5xl font-bold text-aura-gold mb-1 font-display">
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-xs sm:text-sm text-aura-silver uppercase tracking-widest font-medium">
            {label}
        </span>
    </div>
)

export default function ComingSoon() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState({ loading: false, message: '', error: false })
    const [timeLeft, setTimeLeft] = useState({
        days: 100,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        // Set fixed target date: May 21, 2026 (100 days from initial request)
        const targetDate = new Date('2026-05-21T00:00:00')

        const timer = setInterval(() => {
            const now = new Date()
            const difference = targetDate - now

            if (difference <= 0) {
                clearInterval(timer)
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return

        setStatus({ loading: true, message: '', error: false })
        try {
            const templateParams = {
                user_email: email,
                reply_to: email,
                message: `New subscription request from Aura Fashions Coming Soon page: ${email}`
            }

            await emailjs.send(
                'service_swmb7dl',
                'template_o4ov7to',
                templateParams,
                'PVgiJmZyrqHaSmurL'
            )

            setStatus({
                loading: false,
                message: 'Perfect! We will notify you when we go live.',
                error: false
            })
            setEmail('')
        } catch (error) {
            console.error('EmailJS Error:', error)
            setStatus({
                loading: false,
                message: 'Failed to send notification. Please try again later.',
                error: true
            })
        }
    }

    return (
        <div className="min-h-screen bg-aura-black relative flex items-center justify-center overflow-hidden px-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-aura-gold/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-aura-gold/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-4xl w-full relative z-10 text-center">
                {/* Brand Logo / Name */}
                <div className="mb-12 animate-fade-in flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg shadow-aura-gold/20 border border-aura-gold p-2 transform hover:rotate-12 transition-transform duration-500">
                        <img src={logo} alt="Aura Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-aura-white tracking-tight">
                        Aura<span className="text-aura-gold">Fashions</span>
                    </span>
                </div>

                {/* Main Content */}
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-semibold text-aura-white animate-slide-up">
                            Something <span className="text-aura-gold italic">Aura</span> <br />
                            Is Coming Soon
                        </h1>
                        <p className="text-aura-silver text-lg max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            We're meticulously crafting a collection that redefines minimalist fashion.
                            Get ready for premium T-shirts and hoodies that speak volumes.
                        </p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <TimeBox value={timeLeft.days} label="Days" />
                        <TimeBox value={timeLeft.hours} label="Hours" />
                        <TimeBox value={timeLeft.minutes} label="Minutes" />
                        <TimeBox value={timeLeft.seconds} label="Seconds" />
                    </div>

                    {/* Product Showcase */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {/* White T-Shirt */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-aura-gold/30 shadow-sm aspect-[4/5] transition-all duration-700 hover:scale-[1.02] hover:border-aura-gold hover:shadow-xl hover:shadow-aura-gold/10">
                            <img
                                src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800"
                                alt="Aura White T-Shirt"
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-aura-black/90 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <p className="text-aura-gold font-bold">Pure White Essential</p>
                                <p className="text-aura-silver text-sm">Premium Cotton Tee</p>
                            </div>
                        </div>

                        {/* Black Hoodie */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-aura-gold/30 shadow-sm aspect-[4/5] transition-all duration-700 hover:scale-[1.02] hover:border-aura-gold hover:shadow-xl hover:shadow-aura-gold/10">
                            <img
                                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"
                                alt="Aura Black Hoodie"
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-aura-black/90 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <p className="text-aura-gold font-bold">Noir Comfort Hoodie</p>
                                <p className="text-aura-silver text-sm">Ultra-Soft Fleece</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Form */}
                    <div className="max-w-md mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aura-silver group-focus-within:text-aura-gold transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full bg-white/5 border border-aura-gold/30 text-aura-white px-12 py-4 rounded-xl focus:outline-none focus:border-aura-gold focus:bg-white/10 transition-all placeholder:text-aura-silver/50 shadow-inner"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className="bg-aura-gold hover:bg-white group/btn text-aura-black font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg shadow-aura-gold/20"
                                >
                                    {status.loading ? (
                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Notify Me</span>
                                            <Bell className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Status Message */}
                            {status.message && (
                                <div className={`mt-4 flex items-center justify-center space-x-2 animate-fade-in ${status.error ? 'text-red-400' : 'text-green-400'}`}>
                                    {status.error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                    <span className="text-sm font-semibold">{status.message}</span>
                                </div>
                            )}
                        </form>
                        <p className="mt-4 text-aura-silver/40 text-xs">
                            We respect your privacy. No spam, only launch updates.
                        </p>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-20 pt-8 border-t border-aura-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-aura-silver/50 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <p>© 2026 Aura Fashions. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a
                            href="https://www.instagram.com/aurafashionspvt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 hover:text-aura-gold transition-all group/insta"
                        >
                            <Instagram className="w-5 h-5 transition-transform group-hover/insta:scale-110" />
                            <span>Instagram</span>
                        </a>
                        <span className="hover:text-aura-gold cursor-pointer transition-colors">Twitter</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

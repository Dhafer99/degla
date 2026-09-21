import { motion } from 'framer-motion'

/** Fades and lifts children into view the first time they scroll on screen. */
export default function Reveal({ children, delay = 0, y = 28, className, as = 'div', ...rest }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

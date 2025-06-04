import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import Button from '../atoms/Button'
import Text from '../atoms/Text'
import ApperIcon from '../ApperIcon'

const Modal = ({ show, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-travel max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <Text type="h4">{title}</Text>
              <Button variant="ghost" onClick={onClose} icon={ApperIcon} iconProps={{ name: "X" }} className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600" />
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const MainFeatureLayout = ({ children, mainHeader, mainActions, createModal, activityModal }) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-3xl shadow-travel overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-surface-200/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Text type="h3" className="mb-2">Trip Planner</Text>
                <Text type="p">
                  Create and manage your travel itineraries
                </Text>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {mainActions}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {children}
          </div>
        </motion.div>
      </div>

      <Modal show={createModal.show} onClose={createModal.onClose} title="Create New Trip">
        {createModal.content}
      </Modal>

      <Modal show={activityModal.show} onClose={activityModal.onClose} title="Add Activity">
        {activityModal.content}
      </Modal>
    </section>
  )
}

export default MainFeatureLayout
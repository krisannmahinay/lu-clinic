import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const alertDetails = {
  success: {
    color: 'bg-green-500',
    icon: (
      <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    )
  },
  error: {
    color: 'bg-red-500',
    icon: (
      <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    )
  },
  warning: {
    color: 'bg-yellow-500',
    icon: (
      <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
      </svg>
    )
  }
}

const Alert = ({ isOpen: propIsOpen, message, alertType, onClose}) => {
  const [isRendered, setIsRendered] = useState(propIsOpen)
  const { color, icon } = alertDetails[alertType] || {}
  const closeDuration = 3000

  useEffect(() => {
    if(propIsOpen) {
      setIsRendered(true)
      const autoClose = setTimeout( closeDuration)
      return () => clearTimeout(autoClose)
    }
  }, [propIsOpen])

  const close = () => { 
    onClose(false)
  }

  const handleTransition = () => {
    if(!propIsOpen) {
      setIsRendered(false)
    }
  }

  if(!isRendered) {
    return null
  }


  return (
      <Transition
          show={propIsOpen}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          onExited={handleTransition} 
        >
        
          <div className={`text-white px-6 py-4 border-0 absolute rounded top-0 mb-4 mt-20 right-8 w-96 z-50 ${color}`}>
            <div className="flex items-center">
              <span className="inline-block w-5 h-5 mr-3">{icon}</span>
              <span className="inline-block align-middle mr-8" dangerouslySetInnerHTML={{ __html: message }} />
            </div>
            <button className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none" onClick={close}>
              <span>×</span>
            </button>
          </div>
      </Transition>
  )
}

export default Alert;
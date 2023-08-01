import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'

const AlertError = ({ message, initState }) => {
  const [isOpen, setIsOpen] = useState(true);
  const close = () => {
    setIsOpen(false)
  }

  return (
    <Transition
        show={!initState && isOpen}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >

      <div className="text-white px-6 py-4 border-0 absolute rounded top-0 mb-4 mt-20 right-8">
        <div className="flex items-center">
          <div role="alert" >
            
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 w-60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <p>{message}</p>
            </div>
          </div>
        </div>
        <button className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 px-4 py-5 mr-5 outline-none focus:outline-none" onClick={close}>
          <span>×</span>
        </button>
      </div>
    </Transition>
  );
};

export default AlertError;
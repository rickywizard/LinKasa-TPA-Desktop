import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { db, storage } from '../../../utils/firebase'
import PopUp from '../PopUp'
import FormField from '../FormField'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

Modal.setAppElement('#root')

const LostFoundModal = ({ isOpen, closeModal, selectedItem, setSelectedItem }) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  const [form, setForm] = useState({
    name: '',
    classification: '',
    photo: null,
    detail: '',
    foundAt: '',
    status: ''
  })

  useEffect(() => {
    setForm({
      name: selectedItem ? selectedItem.name : '',
      classification: selectedItem ? selectedItem.classification : '',
      foundAt: selectedItem
        ? new Date(selectedItem.foundAt.toDate()).toISOString().slice(0, -8)
        : '',
      detail: selectedItem ? selectedItem.detail : '',
      photo: selectedItem ? selectedItem.photo : null,
      status: selectedItem ? selectedItem.status : ''
    })
  }, [selectedItem])

  useEffect(() => {
    if (form.photo) {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(form.photo)
      setImagePreview(imageUrl)
    }
  }, [form.photo])

  const handleCloseModal = () => {
    closeModal()
    setForm({
      name: '',
      classification: '',
      photo: null,
      detail: '',
      foundAt: '',
      status: ''
    })
    setSelectedItem(null)
    setImagePreview('')
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target

    // Handle file input separately
    if (type === 'file') {
      setForm((prevForm) => ({
        ...prevForm,
        photo: e.target.files[0]
      }))

      // Reset image preview
      setImagePreview('')
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      form.name.trim() === '' ||
      form.classification.trim() === '' ||
      form.foundAt === ''
    ) {
      setError('Field can not be empty')
      return
    }

    try {
      setError('')

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `lostitems/${form.name}-${Date.now()}`)
      await uploadBytes(storageRef, form.photo)

      // Get the download URL
      const photoURL = await getDownloadURL(storageRef)

      const datetimeValue = new Date(form.foundAt)

      if (selectedItem) {
        const itemRef = doc(db, 'lostitems', selectedItem.id)
        await updateDoc(itemRef, {
          ...form,
          foundAt: datetimeValue,
          photo: photoURL
        })

        setSuccess('Successfully updated lost items')
      } else {
        await addDoc(collection(db, 'lostitems'), {
          ...form,
          foundAt: datetimeValue,
          status: 'Unclaimed',
          photo: photoURL
        })
        setSuccess('Successfully add new lost items')
      }
    } catch (error) {
      setError('Failed add new training schedule')
      console.log(error)
    }

    handleCloseModal()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCloseModal}
        className="modal mx-auto my-24"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
      >
        <div className="bg-white p-6 rounded-md w-[36rem] overflow-hidden h-[36rem] overflow-y-auto">
          <span className="flex justify-end">
            <button
              onClick={handleCloseModal}
              className="text-gray-500 p-1 rounded-full hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </span>

          <h2 className="text-2xl mb-4 font-semibold">
            {selectedItem ? 'Update' : 'Add New'} Lost Item Log
          </h2>

          <form onSubmit={handleSubmit}>
            <FormField
              labelName="Item Name"
              type="text"
              name="name"
              placeholder="Item name"
              value={form.name}
              handleChange={handleChange}
            />

            <div className="mt-2">
              <label className="block text-sm font-semibold mb-2">Classification</label>
              <select
                name="classification"
                value={form.classification}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md"
              >
                <option value="">Select classification</option>
                <option value="valuable">Valuable</option>
                <option value="nonvaluable">Non Valuable</option>
                <option value="perishable">Perishable</option>
              </select>
            </div>

            <FormField
              labelName="Found At"
              type="datetime-local"
              name="foundAt"
              placeholder="Found At"
              value={form.foundAt}
              handleChange={handleChange}
            />

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Detail</label>
              <textarea
                name="detail"
                rows="3"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Item details"
                value={form.detail}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                name="photo"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                onChange={handleChange}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-full h-auto rounded-md" />
              )}
            </div>

            <button
              type="submit"
              className="mt-5 bg-green-500 w-full py-2 rounded-md text-center font-semibold text-white hover:bg-green-600"
            >
              Save
            </button>
          </form>
        </div>
      </Modal>

      {error && <PopUp message={error} onClose={() => setError('')} type="error" />}

      {success && <PopUp message={success} onClose={() => setSuccess('')} type="success" />}
    </>
  )
}

export default LostFoundModal

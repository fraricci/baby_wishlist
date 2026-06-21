import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistryView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </Router>
  );
}

function RegistryView() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/items`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const handleReserve = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  const confirmReservation = async (formData) => {
    console.log('Confirming reservation for item:', selectedItem._id);
    const response = await fetch(`${API_URL}/api/items/${selectedItem._id}/reserve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    console.log('Reservation response status:', response.status);

    if (response.ok) {
      console.log('Reservation successful, updating items and closing modal');
      setItems(items.map(item => item._id === selectedItem._id ? { ...item, is_available: false } : item));
      closeModal();
      console.log('closeModal called. SelectedItem should be null now.');
    } else {
      const errorText = await response.text();
      console.error('Reservation failed. Status:', response.status, 'Error:', errorText);
    }
  };

  return (
    <div className="min-h-screen bg-custom-green p-8">
      <div className="mb-12 text-center bg-custom-header p-6 rounded-lg">
        <img 
          src="https://www.kadolog.com/sites/default/files/styles/crop_list_cover/public/2026/359822/WhatsApp%20Image%202026-04-07%20at%2021.32.15.jpeg?h=7d5303a8&itok=juf89gkH" 
          alt="Registry Header" 
          className="w-full h-64 object-contain rounded-lg shadow-lg mb-6"
        />
        <h1 className="text-4xl font-bold mb-4 text-custom-header font-twinkle-star">Liste de Naissance du Petit Oursin</h1>
        <p className="text-black whitespace-pre-line max-w-2xl mx-auto">
          Bienvenue sur notre liste de naissance !

          Nous sommes impatients d'accueillir "le petit oursin" et de commencer cette belle aventure.

          Pour celles et ceux qui souhaiteraient nous donner un petit coup de pouce dans les préparatifs, nous avons rassemblé ici quelques idées.

          Merci infiniment pour votre présence, votre soutien et vos attentions.

          Aurélie & Francesco
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item._id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-200">
            {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-48 object-contain mb-4 rounded" />}
            <h2 className="text-xl font-semibold text-green-900">{item.name}</h2>
            <p className="text-green-700">{item.description}</p>
            <p className="font-bold mt-2 text-green-900">{item.price}€</p>
            {item.is_available ? (
              <button onClick={() => handleReserve(item)} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">Offrir</button>
            ) : (
              <p className="mt-4 text-gray-500 font-bold bg-gray-100 p-2 rounded text-center">Offert</p>
            )}
          </div>
        ))}
      </div>
      {selectedItem && (
        <ReservationModal 
          item={selectedItem} 
          onClose={closeModal} 
          onConfirm={(data) => {
            console.log('onConfirm triggered in RegistryView with data:', data);
            confirmReservation(data);
          }} 
        />
      )}
    </div>
  );
}

function ReservationModal({ item, onClose, onConfirm }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const isFormValid = formData.name.trim() !== '' && formData.email.trim() !== '' && formData.message.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Offrir {item.name}</h2>
        <p className="mb-4 text-sm text-gray-600">
          Nous vous remercions pour votre gentille attention. Vous pouvez contribuer directement par un simple virement. Les détails vous seront envoyés par e-mail.
        </p>
        <input required type="text" placeholder="Name" className="w-full border p-2 mb-2" onChange={e => setFormData({ ...formData, name: e.target.value })} />
        <input required type="email" placeholder="Email" className="w-full border p-2 mb-2" onChange={e => setFormData({ ...formData, email: e.target.value })} />
        <textarea required placeholder="Message" className="w-full border p-2 mb-2" onChange={e => setFormData({ ...formData, message: e.target.value })} />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button 
            onClick={() => {
              console.log('Confirmer button clicked');
              onConfirm(formData);
            }} 
            disabled={!isFormValid}
            className={`px-4 py-2 rounded ${isFormValid ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminView() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: 0, image_url: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/items`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const addItem = async () => {
    const itemToSend = { ...newItem, price: parseInt(newItem.price) };
    const res = await fetch(`${API_URL}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemToSend),
    });
    if (res.ok) {
        const addedItem = await res.json();
        setItems([...items, addedItem]);
        setNewItem({ name: '', description: '', price: 0, image_url: '' });
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm(item);
  };

  const saveEdit = async () => {
    const res = await fetch(`${API_URL}/api/items/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
        const updated = await res.json();
        setItems(items.map(item => item._id === updated._id ? updated : item));
        setEditingId(null);
    }
  };

  const deleteItem = async (id) => {
    if(window.confirm('Are you sure you want to delete this item?')) {
        const res = await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
        if (res.ok) setItems(items.filter(item => item._id !== id));
    }
  };

  const toggleStatus = async (item) => {
    const updatedItem = { ...item, is_available: !item.is_available };
    const res = await fetch(`${API_URL}/api/items/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem),
    });
    if (res.ok) {
        const updated = await res.json();
        setItems(items.map(i => i._id === updated._id ? updated : i));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Management</h1>
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Add New Item</h2>
        <input type="text" placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="border p-2 mr-2" />
        <input type="text" placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="border p-2 mr-2" />
        <input type="number" placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="border p-2 mr-2" />
        <input type="text" placeholder="Image URL" value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} className="border p-2 mr-2" />
        <button onClick={addItem} className="bg-green-500 text-white px-4 py-2 rounded">Add Item</button>
      </div>
      <table className="w-full text-left">
        <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id} className="border-t">
              <td>{editingId === item._id ? <input type="text" value={editForm.image_url} onChange={e => setEditForm({...editForm, image_url: e.target.value})} className="border p-1 w-20" /> : <img src={item.image_url} alt={item.name} className="w-16 h-16 object-contain" />}</td>
              <td>{editingId === item._id ? <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border p-1" /> : item.name}</td>
              <td>{editingId === item._id ? <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="border p-1 w-20" /> : `${item.price}€`}</td>
              <td>{item.is_available ? 'Disponible' : 'Offert'}</td>
              <td>
                {editingId === item._id ? (
                    <button onClick={saveEdit} className="text-green-500 underline mr-2">Save</button>
                ) : (
                    <button onClick={() => startEdit(item)} className="text-blue-500 underline mr-2">Edit</button>
                )}
                <button onClick={() => toggleStatus(item)} className="text-purple-500 underline mr-2">Toggle</button>
                <button onClick={() => deleteItem(item._id)} className="text-red-500 underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

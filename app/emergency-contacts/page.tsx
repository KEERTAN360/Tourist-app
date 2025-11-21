"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Phone, User, Trash2, Home, MapPin, CreditCard, FileText, AlertTriangle } from "lucide-react"

interface Contact {
  id: number
  name: string
  relation: string
  phone: string
}

export default function EmergencyContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" })

  useEffect(() => {
    // Load contacts from localStorage
    const savedContacts = localStorage.getItem("emergencyContacts")
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    } else {
      // Default emergency contacts
      const defaultContacts = [
        { id: 1, name: "Police", relation: "Emergency Service", phone: "100" },
        { id: 2, name: "Ambulance", relation: "Medical Emergency", phone: "108" },
        { id: 3, name: "Fire Brigade", relation: "Fire Emergency", phone: "101" },
        { id: 4, name: "Tourist Helpline", relation: "Tourist Assistance", phone: "1363" },
      ]
      setContacts(defaultContacts)
      localStorage.setItem("emergencyContacts", JSON.stringify(defaultContacts))
    }
  }, [])

  const saveContacts = (updatedContacts: Contact[]) => {
    setContacts(updatedContacts)
    localStorage.setItem("emergencyContacts", JSON.stringify(updatedContacts))
  }

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const updatedContacts = [...contacts, { ...newContact, id: Date.now() }]
      saveContacts(updatedContacts)
      setNewContact({ name: "", relation: "", phone: "" })
      setIsAdding(false)
    }
  }

  const deleteContact = (id: number) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id)
    saveContacts(updatedContacts)
  }

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-4 p-4 pt-6 bg-background border-b border-border shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Emergency Contacts</h1>
      </div>

      <div className="flex-1 p-4 pb-20 space-y-4">
        {/* Add Contact Button */}
        <Button
          onClick={() => setIsAdding(true)}
          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-2xl transition-all duration-300 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Emergency Contact
        </Button>

        {/* Add Contact Form */}
        {isAdding && (
          <Card className="p-6 rounded-3xl border border-border shadow-lg bg-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Add New Contact</h3>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="h-12 rounded-2xl border-border bg-input text-foreground"
              />
              <Input
                placeholder="Relation (e.g., Brother, Friend)"
                value={newContact.relation}
                onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                className="h-12 rounded-2xl border-border bg-input text-foreground"
              />
              <Input
                placeholder="Phone Number"
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="h-12 rounded-2xl border-border bg-input text-foreground"
              />
              <div className="flex gap-2">
                <Button
                  onClick={addContact}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  disabled={!newContact.name || !newContact.phone}
                >
                  Save Contact
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setNewContact({ name: "", relation: "", phone: "" })
                  }}
                  className="flex-1 border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Contacts List */}
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Card key={contact.id} className="placard-3d p-4 rounded-2xl border border-border shadow-md bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relation}</p>
                    <p className="text-sm font-medium text-primary">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => callContact(contact.phone)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-all duration-300 transform hover:scale-110"
                    title={`Call ${contact.name}`}
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                  {!["100", "108", "101", "1363"].includes(contact.phone) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300"
                      onClick={() => deleteContact(contact.id)}
                      title={`Delete ${contact.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {contacts.length === 0 && (
          <Card className="p-8 text-center rounded-3xl border border-border shadow-lg bg-card">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No Emergency Contacts</h3>
            <p className="text-muted-foreground">Add contacts for quick access during emergencies</p>
          </Card>
        )}

        {/* Quick Dial Emergency Services */}
        <Card className="p-6 rounded-3xl border border-border shadow-lg bg-gradient-to-r from-red-500/10 to-orange-500/10">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Quick Emergency Dial</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Police", number: "100", color: "bg-blue-500" },
              { name: "Ambulance", number: "108", color: "bg-red-500" },
              { name: "Fire Brigade", number: "101", color: "bg-orange-500" },
              { name: "Tourist Help", number: "1363", color: "bg-green-500" },
            ].map((service) => (
              <Button
                key={service.number}
                onClick={() => callContact(service.number)}
                className={`h-16 rounded-2xl ${service.color} hover:opacity-90 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg`}
              >
                <div className="flex flex-col items-center">
                  <Phone className="h-5 w-5 mb-1" />
                  <span className="text-xs">{service.name}</span>
                  <span className="text-sm font-bold">{service.number}</span>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 shadow-lg">
        <div className="flex justify-around items-center">
          {[
            { icon: Home, label: "Home", href: "/" },
            { icon: MapPin, label: "Tourist Spots", href: "/tourist-spots" },
            { icon: CreditCard, label: "Pay", href: "/pay" },
            { icon: FileText, label: "Documents", href: "/documents" },
            { icon: AlertTriangle, label: "SOS", href: "/sos" },
          ].map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center gap-1 p-2 h-auto text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="text-center mt-2 pb-2">
          <p className="text-xs text-muted-foreground">Made in Bangalore, India</p>
        </div>
      </div>
    </div>
  )
}

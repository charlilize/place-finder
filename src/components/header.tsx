import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const MIN_ADDRESS_LENGTH = 3
const DELAY = 300

function Header() {
  const [cities, setCities] = useState<string[]>([])  // Cities to show in dropdown
  const [query, setQuery] = useState("")              // Query to search for cities
  
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)  // set timer for 300ms
  const abortControllerRef = useRef<AbortController | null>(null)                // like the cancel button for api requests

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value
    setQuery(currentValue)

    // remove timer if user typed again before 300ms passed
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // remove previous api request if user typed again before 300ms passed
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Clear results if input is empty or too short
    if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
      setCities([]) // clear dropdown
      return
    }

    // store id of timer in ref
    // create timer for 300ms before making api request (if user typed again before 300ms passed, timer is cleared above and new timer is created)
    debounceTimeoutRef.current = setTimeout(async () => {
      // create a way to cancel this specific request later
      abortControllerRef.current = new AbortController()

      try {
        const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&type=city&limit=5&format=json&apiKey=${apiKey}`

        // make api request and link to stop button
        const response = await fetch(url, { 
          signal: abortControllerRef.current.signal 
        })

        if (response.ok) {
          // if request is successful, get data
          const data = await response.json()
          // map data to city names
          const cityNames = (data.results || []).map(
            (result: { formatted: string }) => result.formatted
          )
          // set city names in dropdown
          setCities(cityNames)
        }
      } catch (error) {
        // Ignore abort errors (user typed again before request finished)
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Geocoding error:", error)
        }
      }
    }, DELAY)
  }
  
  return (
    <div className='flex items-center justify-between bg-gray-200 p-5'>
     <div className='flex items-center gap-2'>
      <h1 className='text-2xl font-bold'>Place Finder</h1>
     </div>
     <form className='w-full max-w-3xl'>
      <FieldGroup>
        <div className='grid grid-cols-[1fr_1fr_auto] gap-4 items-end'>
        <Field>
          <FieldLabel>Location</FieldLabel>
          <Combobox items={cities}>
              <ComboboxInput 
                type="text" 
                placeholder="Search city..." 
                showTrigger={false} 
                className="bg-white"
                onChange={handleInputChange}
              />
              <ComboboxContent>
                <ComboboxEmpty>
                  {query.length < MIN_ADDRESS_LENGTH 
                    ? "Type at least 3 characters..." 
                    : "No cities found."}
                </ComboboxEmpty>
                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
        </Field>
        <Field>
          <FieldLabel>Looking for</FieldLabel>
          <Input type="text" placeholder="Parks, coffee, museums..." className='bg-white' />
        </Field>
        <Button type="submit" size="lg">Search</Button>
        </div>
      </FieldGroup>
     </form>

     <div className='flex items-center gap-2'>
      <h1>About</h1>
     </div>
    </div>
  )
}

export default Header

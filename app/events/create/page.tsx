"use client";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { EventMode } from "@/lib/types";

const CreateEventPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<EventMode>("online");
  const [audience, setAudience] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [agenda, setAgenda] = useState<string[]>([]);
  const [agendaInput, setAgendaInput] = useState("");

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const addAgendaItem = () => {
    const value = agendaInput.trim();
    if (!value) return;
    setAgenda((prev) => [...prev, value]);
    setAgendaInput("");
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const handleAgendaKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAgendaItem();
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please choose an event image.");
      return;
    }
    if (agenda.length === 0) {
      setError("Add at least one agenda item.");
      return;
    }
    if (tags.length === 0) {
      setError("Add at least one tag.");
      return;
    }

    setIsPending(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("overview", overview);
    formData.append("venue", venue);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("mode", mode);
    formData.append("audience", audience);
    formData.append("organizer", organizer);
    formData.append("image", image);
    agenda.forEach((item) => formData.append("agenda", item));
    tags.forEach((tag) => formData.append("tags", tag));

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message ?? "Failed to create event.");
        return;
      }

      router.push(`/events/${result.event.slug}`);
    } catch (err) {
      console.error("Failed to create event", err);
      setError("Something went wrong while creating the event.");
    } finally {
      setIsPending(false);
    }
  };

  const inputClass =
    "bg-dark-200 placeholder:text-light-200 w-full rounded-[6px] px-5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <section className="mx-auto w-full max-w-3xl space-y-8 py-8">
      <div className="bg-dark-100 border-dark-200 card-shadow rounded-[10px] border px-5 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-schibsted-grotesk text-2xl font-bold">
            Create Event
          </h2>

          {error && <span className="text-destructive text-sm">{error}</span>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <textarea
            placeholder="Short overview"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            required
            rows={2}
            maxLength={500}
            className={inputClass}
          />

          <textarea
            placeholder="Full description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            maxLength={1000}
            className={inputClass}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className={inputClass}
            />
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as EventMode)}
              className={inputClass}
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Audience (e.g. Developers, Designers)"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
            className={inputClass}
          />

          {/* Agenda */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add an agenda item and press Enter"
                value={agendaInput}
                onChange={(e) => setAgendaInput(e.target.value)}
                onKeyDown={handleAgendaKeyDown}
                className={inputClass}
              />
              <button
                type="button"
                onClick={addAgendaItem}
                className="pill shrink-0 cursor-pointer"
              >
                Add
              </button>
            </div>
            {agenda.length > 0 && (
              <ul className="list-disc list-inside space-y-1">
                {agenda.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-center gap-2 text-sm">
                    <span className="flex-1">{item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAgenda((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="text-destructive cursor-pointer text-xs"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className={inputClass}
              />
              <button
                type="button"
                onClick={addTag}
                className="pill shrink-0 cursor-pointer"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-row flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <div key={tag} className="pill flex items-center gap-2">
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                      className="text-destructive cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div className="bg-dark-200 flex items-center gap-3 rounded-[6px] px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-light-200 truncate text-sm">
                {image ? image.name : "No image selected"}
              </p>
            </div>
            <label className="pill cursor-pointer">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 min-w-[150px] rounded-[6px] px-6 py-2.5 font-semibold text-black disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateEventPage;

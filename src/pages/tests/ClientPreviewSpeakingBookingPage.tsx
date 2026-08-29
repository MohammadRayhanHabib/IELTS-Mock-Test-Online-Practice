import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addDays,
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "date-fns";
import {
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
];

const BOOKING_KEY = "lexora.client-preview.speaking.booking.v1";

const ClientPreviewSpeakingBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testNumber = useMemo(() => {
    const parsed = Number(new URLSearchParams(location.search).get("test"));
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 4 ? parsed : 1;
  }, [location.search]);
  const today = useMemo(() => startOfDay(new Date()), []);
  const initialDate = useMemo(() => addDays(today, 2), [today]);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(initialDate));
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const calendarDays = useMemo(() => {
    const leadingBlanks = getDay(visibleMonth);
    return [
      ...Array.from({ length: leadingBlanks }, () => null),
      ...Array.from(
        { length: getDaysInMonth(visibleMonth) },
        (_, index) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1),
      ),
    ];
  }, [visibleMonth]);

  const confirmBooking = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Enter your name and email to confirm the speaking session.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    window.localStorage.setItem(
      BOOKING_KEY,
      JSON.stringify({
        date: selectedDate.toISOString(),
        time: selectedTime,
        name: name.trim(),
        email: email.trim(),
      }),
    );
    navigate(
      `/client-preview/speaking/pre-test?booking=confirmed&test=${testNumber}`,
    );
  };

  return (
    <>
      <Helmet>
        <title>Book a Speaking Mock Test – Lexora Academy</title>
      </Helmet>

      <div className="mx-auto w-full max-w-[1152px] pb-12">
        <section className="rounded-xl border border-[#d9dce3] bg-[#f3f5fa] px-6 py-6 shadow-[0_3px_8px_rgba(30,35,45,0.12)] sm:px-8">
          <h1 className="font-serif text-2xl font-bold text-[#15171c] sm:text-[28px]">
            Book a Speaking Mock Test Session
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#596273]">
            Choose an available date and time, then confirm your details before the microphone check.
          </p>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.18fr)_minmax(330px,0.82fr)]">
          <div className="rounded-xl border border-[#dfe2e8] bg-white p-5 shadow-[0_4px_12px_rgba(31,38,50,0.14)] sm:p-7">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_116px]">
              <div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
                    aria-label="Previous month"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#46505f] transition-colors hover:bg-[#f5f6f8] focus:outline-none focus:ring-2 focus:ring-[#f18490]"
                  >
                    <FiChevronLeft aria-hidden="true" />
                  </button>
                  <h2 className="text-sm font-semibold text-[#252a33]">
                    {format(visibleMonth, "MMMM yyyy")}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
                    aria-label="Next month"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7c9cc] text-[#7d252d] transition-colors hover:bg-[#f3b7bc] focus:outline-none focus:ring-2 focus:ring-[#f18490]"
                  >
                    <FiChevronRight aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#7f8793]">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-y-2 text-center">
                  {calendarDays.map((date, index) => {
                    if (!date) return <span key={`blank-${index}`} aria-hidden="true" />;
                    const disabled = isBefore(date, today);
                    const selected = isSameDay(date, selectedDate);
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        disabled={disabled}
                        aria-pressed={selected}
                        aria-label={format(date, "EEEE, MMMM d, yyyy")}
                        onClick={() => setSelectedDate(date)}
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#f18490] focus:ring-offset-2 ${
                          selected
                            ? "bg-[#ef8f96] text-white"
                            : disabled
                              ? "cursor-not-allowed text-[#c8ccd3]"
                              : "text-[#3e4652] hover:bg-[#fff0f1]"
                        }`}
                      >
                        {format(date, "d")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid content-start gap-2" aria-label="Available appointment times">
                {TIME_SLOTS.map((time) => {
                  const selected = time === selectedTime;
                  return (
                    <button
                      key={time}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedTime(time)}
                      className={`min-h-10 rounded-full border px-3 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#f18490] focus:ring-offset-2 ${
                        selected
                          ? "border-[#94323a] bg-[#94323a] text-white"
                          : "border-[#478cff] bg-white text-[#2f4666] hover:bg-[#f2f7ff]"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <form
            onSubmit={confirmBooking}
            className="rounded-xl border border-[#dfe2e8] bg-white p-5 shadow-[0_4px_12px_rgba(31,38,50,0.14)] sm:p-7"
          >
            <h2 className="text-base font-bold text-[#262a31]">Confirm Your Booking</h2>
            <div className="mt-4 rounded-xl border border-[#efb9bd] bg-[#fad8da] px-5 py-4 text-[#2d2022]">
              <div className="flex items-start gap-3">
                <FiCalendar aria-hidden="true" className="mt-0.5 h-5 w-5 text-[#7c3036]" />
                <div>
                  <p className="text-xs font-semibold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                  <p className="mt-1 text-sm font-black tabular-nums">{selectedTime}</p>
                </div>
              </div>
            </div>

            <label className="mt-5 block text-xs font-semibold text-[#404752]" htmlFor="speaking-booking-name">
              Name
            </label>
            <input
              id="speaking-booking-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              placeholder="Your full name"
              autoComplete="name"
              className="mt-1.5 h-11 w-full rounded-lg border border-[#d9dce2] px-3 text-sm outline-none placeholder:text-[#a5aab2] focus:border-[#bb4a53] focus:ring-2 focus:ring-[#f1b9be]/50"
            />

            <label className="mt-4 block text-xs font-semibold text-[#404752]" htmlFor="speaking-booking-email">
              Email
            </label>
            <input
              id="speaking-booking-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-1.5 h-11 w-full rounded-lg border border-[#d9dce2] px-3 text-sm outline-none placeholder:text-[#a5aab2] focus:border-[#bb4a53] focus:ring-2 focus:ring-[#f1b9be]/50"
            />

            {error ? (
              <p role="alert" className="mt-3 text-xs font-semibold text-[#b42331]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#bd4146] px-5 text-sm font-bold text-white transition-colors hover:bg-[#a7353a] focus:outline-none focus:ring-2 focus:ring-[#e58c93] focus:ring-offset-2"
            >
              <FiCheck aria-hidden="true" />
              Confirm
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default ClientPreviewSpeakingBookingPage;

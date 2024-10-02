import React from 'react';

export default function page() {
  return (
    <>
      <h1 className="mt-10 text-center text-4xl font-bold">
        Welcome to the colors config
      </h1>
      <p className="mt-5 text-center">
        This is a boilerplate for Next.js and Supabase
      </p>
      <section className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-background" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-card" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-card-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-popover" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-popover-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-primary" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-primary-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-primary-light" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-primary-light-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-secondary" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-secondary-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-secondary-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-tertiary" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-tertiary-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-muted" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-muted-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-accent" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-accent-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-success" />
        <div className="bg-success-foregound h-[40px] w-[40px] rounded-full border-2" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-warning" />
        <div className="bg-warning-foregound h-[40px] w-[40px] rounded-full border-2" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-destructive" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-destructive-foreground" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-border" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-input" />
        <div className="h-[40px] w-[40px] rounded-full border-2 bg-ring" />
        <div className="bg-radius h-[40px] w-[40px] rounded-full border-2" />
      </section>
    </>
  );
}

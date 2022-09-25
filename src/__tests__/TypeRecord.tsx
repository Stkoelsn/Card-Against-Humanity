// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import React, { useEffect, useState } from "react";
import "@testing-library/jest-dom";
import {act, renderHook, fireEvent, waitFor, screen} from '@testing-library/react';
import useTypeRecord, { erase, insert, replace, Action, Reducer, initialize } from '../core/TypeRecord'
import { ForInitializer } from "typescript";
import TypeRecord from "../core/TypeRecord";

function textToActions(text: string, populate: boolean = false): Action[] {
  var actions: Action[] = [];

  if(populate)
    actions.push({type: "populate", content: text});

  for(var i = 0; i < text.length; i++)
    actions.push({type: "char", content: text.substring(i, i + 1)});

  return actions;
}

function dispatchActions(dispatcher: (action: any) => void, actions: Action[]) {
  actions.map((action) => dispatcher(action));
}

type Props = {
  text: string
}

test("utility functions erase", async () => {
  const str = "Hello, World";
  expect(erase(str, 5)).toBe("Hello World");
});

test("utility functions insert", async () => {
  const str = "Hello World";
  expect(insert(str, 5, ",")).toBe("Hello, World");
});

test("utility functions replace", async () => {
  const str = "foo + bar";
  expect(replace(str, 4, "-")).toBe("foo - bar");
});

test("utility functions replace boundary", async () => {
  const str = "Hello.";
  expect(replace(str, 5, ",")).toBe("Hello,");
});

test("random", async () => {
  const str = "HelloO";
  expect(replace(str, 5, "O")).toBe("HelloO");
})

test("single correct word complete", async () => {
  const text = "HelloWorld";
  const actions = textToActions(text);
  var state = initialize(text);

  for(var action in actions) 
    state = Reducer(state, actions[action]);

  expect(state.words.length).toBe(1);
  expect(state.words[0]).toBe(text);
  expect(state.wordIndex).toBe(0);
  expect(state.input).toBe(text);
  expect(state.complete).toBe(true);
});

test("single incorrect word complete", async () => {
  const text = "HelloWorld";
  const typo = "HellOworld";
  const actions = textToActions(typo);
  var state = initialize(text);

  for(var action in actions) 
    state = Reducer(state, actions[action]);

  expect(state.words.length).toBe(1);
  expect(state.words[0]).toBe(text);
  expect(state.wordIndex).toBe(0);
  expect(state.input).toBe(typo);
  expect(state.complete).toBe(false);
});

test("multiple correct words complete", async () => {
  const text = "Hello, World!";
  const actions = textToActions(text);
  var state = initialize(text);

  for(var action in actions) 
    state = Reducer(state, actions[action]);

  expect(state.words.length).toBe(2);
  expect(state.wordIndex).toBe(1);
  expect(state.input).toBe(state.words[1]);
  expect(state.complete).toBe(true);
});

test("multiple incorrect words complete", async () => {
  const text = "Hello, World!";
  const typo = "HelloOOOPS World!";

  const actions = textToActions(typo);
  var state = initialize(text);

  for(var action in actions) 
    state = Reducer(state, actions[action]);

  expect(state.words.length).toBe(2);
  expect(state.wordIndex).toBe(0);
  expect(state.input).toBe("Hello!");
  expect(state.complete).toBe(false);
});

test("multiple incorrect words complete edge", async () => {
  const text = "Hello, World!";
  const typo = "HelloOOOPS, World!";

  const actions = textToActions(typo);
  var state = initialize(text);

  for(var action in actions) 
    state = Reducer(state, actions[action]);

  expect(state.words.length).toBe(2);
  expect(state.wordIndex).toBe(1);
  expect(state.input).toBe(state.words[1]);
  expect(state.complete).toBe(true);
});
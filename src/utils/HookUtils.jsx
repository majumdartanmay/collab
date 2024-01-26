import { useCookies } from "react-cookie";
import { useParams } from 'react-router-dom';
import { atom, useAtom } from 'jotai';
import { useRef, useState } from 'react'
import { useNavigate, /* other hooks */ } from 'react-router-dom';

export function navigateHook() {
  return useNavigate();
}

export function cookiesHook(param) {
  return useCookies(param);
}

export function refHook(param) {
  return  useRef(param);
}

export function stateHook(param) {
  return  useState(param);
}

export function createAtomInstance(param) {
  return atom(param);
}

export function atomHook(atom) {
  return useAtom(atom);
}

export function paramsHook() {
  return useParams();
}

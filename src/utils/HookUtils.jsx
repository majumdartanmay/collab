import { useCookies } from "react-cookie";
import { useParams } from 'react-router-dom';
import { atom, useAtom } from 'jotai';
import { useRef, useState } from 'react'
import { useNavigate, /* other hooks */ } from 'react-router-dom';

/**
 * Return the navigate hook
 *
 * @returns {import("react-router-dom").NavigateFunction} UseNavigate hook
 */
export function navigateHook() {
  return useNavigate();
}

/**
 * Return the cookies hook 
 *
 * @param {Array} param - Cookies idetified
 * @returns {@function} Cookies hook
 */
export function cookiesHook(param) {
  return useCookies(param);
}

/**
 * Reference hook
 *
 * @param {Object} param - Name of the reference
 * @returns {import("react").MutableRefObject Property of component
 */
export function refHook(param) {
  return  useRef(param);
}

/**
 * Wrapper for useState
 *
 * @param {import("react").Dispatch} param - 
 * @returns {import("react").Dispatch} state of the component
 */
export function stateHook(param) {
  return  useState(param);
}

/**
 * Creates an instance of atom
 *
 * @param {Object} param - You need to have some identified for your state
 * @returns {PrimitiveAtom} An atom instance which is probably
 * a part of component state
 */
export function createAtomInstance(param) {
  return atom(param);
}

/**
 * Gets the output of useAtom hook
 *
 * @param {AtomType} atom - This should be the output of createAtomInstance
 * @returns {Object} output of useAtom
 */
export function atomHook(atom) {
  return useAtom(atom);
}

/**
 * Wrapper for useParams
 *
 * @param {import("react").Dispatch} param - 
 * @returns {Object} Parameters used in url
 */
export function paramsHook() {
  return useParams();
}

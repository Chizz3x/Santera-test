import { ComponentProps } from "react";
import * as ModalExample from "./example";
import * as ModalOrderForm from "./order-form";

export const modals = [ModalExample, ModalOrderForm];

export const changeModals = <
  D extends NModals.TModals
>(
	eventDetail: D
): CustomEvent<D> =>
	new CustomEvent("changeModals", { detail: eventDetail });

export namespace NModals {
	export interface IDefaultProps {
		open?: string | boolean | null;
	}
	export type TModals = Partial<Record<typeof modals[number]["name"], ComponentProps<typeof modals[number]["Modal"]> | null>>;
}
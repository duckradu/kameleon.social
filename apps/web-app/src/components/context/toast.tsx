import { PropTypes, normalizeProps, useMachine } from "@zag-js/solid";
import * as toast from "@zag-js/toast";
import {
  Accessor,
  For,
  JSX,
  ParentProps,
  createContext,
  createMemo,
  createUniqueId,
  useContext,
} from "solid-js";

import { Toast } from "~/components/ui/toast";

export interface ToastOptions {
  title: JSX.Element;
  description: JSX.Element;

  render?: (api: Accessor<toast.Api<PropTypes, ToastOptions>>) => JSX.Element;
}

const ToastContext =
  createContext<Accessor<toast.GroupApi<PropTypes, ToastOptions>>>();

export function ToastProvider(props: ParentProps) {
  const [state, send] = useMachine(
    toast.group.machine<ToastOptions>({
      id: createUniqueId(),

      gutter: "0.75rem", // TODO: replace with theme.spacing.xs
      offsets: {
        top: "0.75rem",
        right: "0.75rem",
        bottom: "0.75rem",
        left: "0.75rem",
      },
      placement: "bottom-end",

      duration: 7000,
      removeDelay: 150, // TODO: Get this into a const

      pauseOnInteraction: true,
      pauseOnPageIdle: true,

      max: 5,
    })
  );

  const api = createMemo(() =>
    toast.group.connect(state, send, normalizeProps)
  );

  const placements = createMemo(
    () => Object.keys(api().toastsByPlacement) as toast.Placement[]
  );

  return (
    <ToastContext.Provider value={api}>
      <For each={placements()}>
        {(placement) => (
          <div {...api().getGroupProps({ placement })}>
            <For each={api().toastsByPlacement[placement]}>
              {(toast) => <Toast actor={toast} />}
            </For>
          </div>
        )}
      </For>

      {props.children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("`useToast` must be used within a ToastProvider");
  }

  return context;
}

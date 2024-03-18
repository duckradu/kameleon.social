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

      pauseOnInteraction: true,
      pauseOnPageIdle: true,

      max: 5,
    })
  );

  const api = createMemo(() =>
    toast.group.connect(state, send, normalizeProps)
  );

  return (
    <ToastContext.Provider value={api}>
      <For each={Object.entries(api().toastsByPlacement)}>
        {([placement, toasts]) => (
          <div
            style={{
              gap: "var(--toast-gutter)",
            }}
            {...api().getGroupProps({
              placement: placement as toast.Placement,
            })}
          >
            <For each={toasts}>{(toast) => <Toast actor={toast} />}</For>
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

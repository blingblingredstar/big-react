export type WorkTag =
	| typeof HostComponent
	| typeof HostRoot
	| typeof HostText
	| typeof FunctionComponent;

export const FunctionComponent /** */ = 0;
/** Container Element pass to createRoot() */
export const HostRoot /**          */ = 1;
/** like <div><A /></div> refer to div */
export const HostComponent /**     */ = 5;
/** like <div>text</div> refer to text */
export const HostText /**          */ = 6;

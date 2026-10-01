<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting published git history — force pushing, or rebasing/amending/squashing commits that are already pushed — as it rewrites history on Lovable's side and the user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve the supplied Lena Weber HTML content and CSS in the imported site module and global stylesheet, because exact visual fidelity is the primary requirement.
- Store original image bytes as Lovable asset pointers, because imported photos must remain unchanged without bloating source control.
- Keep Stripe checkout and webhook endpoints on TanStack server routes, because the original Netlify functions cannot run in this runtime.

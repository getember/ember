<!--
// Copyright © 2024 Digitrans Inc.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
-->

<script lang="ts">
  export let fill: string = 'currentColor'
  export let size: 'small' | 'medium' | 'large' = 'small'
</script>

<svg class="svg-{size}" {fill} width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M2 9C2 6.23858 4.23858 4 7 4H10.6716C11.4672 4 12.2303 4.31607 12.7929 4.87868L15.6213 7.70711C15.8089 7.89464 16.0632 8 16.3284 8H25C27.7614 8 30 10.2386 30 13V23C30 25.7614 27.7614 28 25 28H7C4.23858 28 2 25.7614 2 23V9ZM7 6C5.34315 6 4 7.34315 4 9V23C4 24.6569 5.34315 26 7 26H25C26.6569 26 28 24.6569 28 23V13C28 11.3431 26.6569 10 25 10H16.3284C15.5328 10 14.7697 9.68393 14.2071 9.12132L11.3787 6.29289C11.1911 6.10536 10.9368 6 10.6716 6H7Z"
  />
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M7 6C5.34315 6 4 7.34315 4 9V23C4 24.6569 5.34315 26 7 26H25C26.6569 26 28 24.6569 28 23V13C28 11.3431 26.6569 10 25 10H16.3284C15.5328 10 14.7697 9.68393 14.2071 9.12132L11.3787 6.29289C11.1911 6.10536 10.9368 6 10.6716 6H7Z"
    fill-opacity="0.1"
  />
</svg>

<!--
// Copyright © 2023 Digitrans Inc.
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
  export let size: 'small' | 'medium' | 'large'
  const fill: string = 'var(--theme-caption-color)'
</script>

<svg class="svg-{size}" {fill} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M9 5.99988C9 6.55216 9.44772 6.99988 10 6.99988C10.5523 6.99988 11 6.55216 11 5.99988C11 5.44759 10.5523 4.99988 10 4.99988C9.44772 4.99988 9 5.44759 9 5.99988Z"
  />
  <path
    d="M9 9.99988C9 10.5522 9.44772 10.9999 10 10.9999C10.5523 10.9999 11 10.5522 11 9.99988C11 9.44759 10.5523 8.99988 10 8.99988C9.44772 8.99988 9 9.44759 9 9.99988Z"
  />
  <path
    d="M10 14.9999C9.44772 14.9999 9 14.5522 9 13.9999C9 13.4476 9.44772 12.9999 10 12.9999C10.5523 12.9999 11 13.4476 11 13.9999C11 14.5522 10.5523 14.9999 10 14.9999Z"
  />
  <path
    d="M9 2C9 2.55228 9.44772 3 10 3C10.5523 3 11 2.55228 11 2C11 1.44772 10.5523 1 10 1C9.44772 1 9 1.44772 9 2Z"
  />
  <path
    d="M5 5.99988C5 6.55216 5.44772 6.99988 6 6.99988C6.55229 6.99988 7 6.55216 7 5.99988C7 5.44759 6.55229 4.99988 6 4.99988C5.44772 4.99988 5 5.44759 5 5.99988Z"
  />
  <path
    d="M5 9.99988C5 10.5522 5.44772 10.9999 6 10.9999C6.55228 10.9999 7 10.5522 7 9.99988C7 9.44759 6.55229 8.99988 6 8.99988C5.44772 8.99988 5 9.44759 5 9.99988Z"
  />
  <path
    d="M6 14.9999C5.44772 14.9999 5 14.5522 5 13.9999C5 13.4476 5.44772 12.9999 6 12.9999C6.55228 12.9999 7 13.4476 7 13.9999C7 14.5522 6.55228 14.9999 6 14.9999Z"
  />
  <path d="M5 2C5 2.55228 5.44772 3 6 3C6.55229 3 7 2.55228 7 2C7 1.44772 6.55229 1 6 1C5.44772 1 5 1.44772 5 2Z" />
</svg>

<script setup lang="ts">
/**
 * Ported from global-footer.hbs.
 *
 * The copyright year was hardcoded and bumped by hand each year (see the "2021 footer
 * copyright" and "Update Footer date" commits). It is derived from the build date now,
 * so a rebuild keeps it current without anyone remembering. Prerendering bakes it in, so
 * it is only as fresh as the last deploy — no worse than a hand-edited literal, minus
 * the chore.
 */
const year = new Date().getFullYear()
</script>

<template>
  <!-- Wrapper div matches the classic Ember component's own element, keeping the sibling
       count under .bm-content identical to production. See GlobalHeader for why that
       matters. -->
  <div class="global-footer">
    <footer>
      <div class="container-fluid">
        <div class="row">
          <FooterNav />

          <div class="intro col-12 col-md-3 col-lg-5">
            <p>
              We are a Vancouver, BC based Web &amp; Web Application Consulting, Development
              &amp; Support company. We have helped companies, &amp; individuals, with their
              web based challenges, and would love to help you.
            </p>
            <p>
              To reach someone about a project please <NuxtLink to="/contact">contact us</NuxtLink>.
            </p>
          </div>

          <div class="contact col-12 col-md-3 col-lg-3">
            <!--
              The original nested this <h4> inside a <p>, which is invalid — browsers
              auto-close the paragraph before the heading, so the markup never matched the
              intent. Unwrapped.
            -->
            <h4>Small Robot Corp.</h4>
            <p>
              Vancouver, BC, Canada<br>
              <a href="tel:+1-604-764-6269">
                <i class="fas fa-phone-square" aria-hidden="true" /> +1-604-764-6269
              </a>
            </p>
            <p>
              [ <NuxtLink to="/contact" title="Contact"><i class="fa fa-envelope" aria-hidden="true" /></NuxtLink> ]
              [ <a href="https://twitter.com/bmx269" title="Follow us on Twitter" target="_blank" rel="noopener"><i class="fab fa-twitter" aria-hidden="true" /></a> ]
              [ <a href="https://github.com/bmx269" title="Visit our Github" target="_blank" rel="noopener"><i class="fab fa-github" aria-hidden="true" /></a> ]
            </p>
          </div>

          <div class="copyright col-12">
            ©{{ year }} Small Robot Corp. All Rights Reserved. Built with Drupal + Nuxt.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

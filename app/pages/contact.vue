<script setup lang="ts">
const { data: page } = await usePage('/contact')

useSeo({
  title: 'Small Robot Co. | Contact Us',
  url: '/contact',
})
</script>

<template>
  <div>
    <LoadingSpinner v-if="!page" />
    <template v-else>
      <GlobalHeader :page="page" />

      <PageSection
        v-for="section in ((page.section ?? []) as any[])"
        :key="section.id"
        :section="section"
      />

      <!--
        Hardcoded in the old contact.hbs rather than coming from the CMS.

        Note this same copy also exists in Drupal, in a section flagged show=False — so
        it is duplicated, with the CMS copy disabled and the template copy live. Porting
        the template version preserves what production actually renders. Enabling the CMS
        section and deleting this markup would be the tidier end state, but that is a
        content change on the Drupal side, not a port decision.
      -->
      <section class="page-section">
        <div class="outer">
          <div class="overlay">
            <div class="content-wrapper">
              <div class="container-fluid">
                <div class="row justify-content-center">
                  <div class="section-column col-12 col-md-8 col-lg-7 col-xl-6">
                    <div class="element-text">
                      <div class="inner">
                        <h2>We <strong>want</strong> to hear your ideas.</h2>
                        <p class="lead">
                          We get a majority of our business by word of mouth, and we truly
                          appreciate the refreshing change that personal conversations can
                          bring. In the world of texts, email, social media, or whatever
                          technology can make our lives not personal, we would rather you
                          contact us with your voice.
                        </p>
                        <p>
                          We also understand that sometimes that is not possible, for that
                          reason, we have our means of contact here.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="section-column col-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="element-text">
                      <div class="inner">
                        <h4>Location</h4>
                        <p>
                          <strong>Small Robot Corp.</strong><br>
                          Vancouver, BC,<br>
                          Canada
                        </p>
                        <h4>Voice</h4>
                        <p>
                          <a href="tel:+1-604-764-6269">
                            <i class="fas fa-phone-square" aria-hidden="true" /> +1-604-764-6269
                          </a><br>
                          <a href="mailto:info@smallrobot.co">
                            <i class="fas fa-envelope-square" aria-hidden="true" /> Email us
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!--
        TODO(step 6): the contact form section that followed this one.

        Deliberately NOT ported, because it cannot work as written. The old form posted to
        `/` with a `form-name` field — that is Netlify Forms, a platform feature with no
        backend of our own behind it. On Apache with an SPA fallback, `POST /` returns
        index.html with 200, so the fetch resolves, the success flash fires, and the
        visitor is told the message was sent while it is silently discarded. A form that
        looks like it works is worse than no form.

        The phone number and email address above remain reachable in the meantime.

        Needs: a handler (a small PHP mail script suits the
        web host), validation to replace ember-cp-validations, flash messages to
        replace ember-cli-flash, and error handling that actually checks response.ok —
        the old code treated any non-throwing response as success.
      -->

      <GlobalFooter />
    </template>
  </div>
</template>
